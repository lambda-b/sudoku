import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";

type PuzzleManifest = {
  count: number;
};

const infraDir = fileURLToPath(new URL("..", import.meta.url));
const projectRoot = join(infraDir, "..");

export class SudokuWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName = this.node.tryGetContext("domainName") as
      | string
      | undefined;
    const hostedZoneName = this.node.tryGetContext("hostedZoneName") as
      | string
      | undefined;
    const certificateArn = this.node.tryGetContext("certificateArn") as
      | string
      | undefined;
    const bucketName = this.node.tryGetContext("bucketName") as
      | string
      | undefined;
    const importExistingResources =
      this.node.tryGetContext("importExistingResources") === "true";
    const siteIndexDocument =
      (this.node.tryGetContext("siteIndexDocument") as string | undefined) ??
      "index.html";
    const siteErrorDocument =
      (this.node.tryGetContext("siteErrorDocument") as string | undefined) ??
      siteIndexDocument;
    const puzzleCount =
      Number(this.node.tryGetContext("puzzleCount")) || readPuzzleCount();

    const bucket = new s3.Bucket(this, "SiteBucket", {
      bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: !importExistingResources,
    });

    const randomPuzzleFunction = importExistingResources
      ? undefined
      : new cloudfront.Function(this, "RandomPuzzleFunction", {
          code: cloudfront.FunctionCode.fromInline(
            readRandomPuzzleFunctionCode(puzzleCount),
          ),
          comment:
            "Rewrites /api/puzzles/random to a random static puzzle JSON.",
          runtime: cloudfront.FunctionRuntime.JS_2_0,
        });

    const certificate =
      domainName && certificateArn
        ? acm.Certificate.fromCertificateArn(
            this,
            "SiteCertificate",
            certificateArn,
          )
        : undefined;

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      certificate,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        functionAssociations: randomPuzzleFunction
          ? [
              {
                eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                function: randomPuzzleFunction,
              },
            ]
          : undefined,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: siteIndexDocument,
      domainNames: domainName ? [domainName] : undefined,
      errorResponses: importExistingResources
        ? undefined
        : [
            {
              httpStatus: 403,
              responseHttpStatus: 200,
              responsePagePath: `/${siteErrorDocument}`,
              ttl: Duration.minutes(5),
            },
            {
              httpStatus: 404,
              responseHttpStatus: 200,
              responsePagePath: `/${siteErrorDocument}`,
              ttl: Duration.minutes(5),
            },
          ],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: importExistingResources
        ? cloudfront.PriceClass.PRICE_CLASS_ALL
        : cloudfront.PriceClass.PRICE_CLASS_200,
    });

    if (!importExistingResources) {
      new s3deploy.BucketDeployment(this, "DeployWebsite", {
        destinationBucket: bucket,
        distribution,
        distributionPaths: ["/*"],
        prune: true,
        sources: [s3deploy.Source.asset(join(projectRoot, "dist"))],
      });
    }

    if (domainName && hostedZoneName) {
      const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
        domainName: hostedZoneName,
      });

      new route53.ARecord(this, "AliasRecord", {
        recordName: domainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(distribution),
        ),
        zone: hostedZone,
      });

      new route53.AaaaRecord(this, "AliasRecordIpv6", {
        recordName: domainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(distribution),
        ),
        zone: hostedZone,
      });
    }

    new CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
    });
    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
    new CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });
  }
}

const readPuzzleCount = (): number => {
  const manifestPath = join(projectRoot, "public/puzzles/manifest.json");
  const manifest = JSON.parse(
    readFileSync(manifestPath, "utf-8"),
  ) as PuzzleManifest;
  return manifest.count;
};

const readRandomPuzzleFunctionCode = (puzzleCount: number): string => {
  const functionPath = join(infraDir, "cloudfront-functions/random-puzzle.js");
  return readFileSync(functionPath, "utf-8").replace(
    "__PUZZLE_COUNT__",
    String(puzzleCount),
  );
};

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
const bucketName = "dancinglinks-sudoku-solver";
const puzzleBucketName = "dancinglinks-sudoku-solver-puzzles";
const certificateArn =
  "arn:aws:acm:us-east-1:154539905353:certificate/28775c3e-1141-4ef3-8a41-cde305b8d76f";
const domainName = "sudoku.pisan-zapra.com";
const hostedZoneName = "pisan-zapra.com";
const siteDocument = "index.html";

export class SudokuWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const puzzleCount = readPuzzleCount();

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: true,
    });
    const puzzleBucket = new s3.Bucket(this, "PuzzleBucket", {
      bucketName: puzzleBucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: true,
    });

    const randomPuzzleFunction = new cloudfront.Function(
      this,
      "RandomPuzzleFunction",
      {
        code: cloudfront.FunctionCode.fromInline(
          readRandomPuzzleFunctionCode(puzzleCount),
        ),
        comment: "Rewrites /api/puzzles/random to a random static puzzle JSON.",
        runtime: cloudfront.FunctionRuntime.JS_2_0,
      },
    );

    const randomPuzzleResponseHeadersPolicy =
      new cloudfront.ResponseHeadersPolicy(
        this,
        "RandomPuzzleResponseHeadersPolicy",
        {
          customHeadersBehavior: {
            customHeaders: [
              {
                header: "Cache-Control",
                override: true,
                value: "no-store",
              },
            ],
          },
        },
      );

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "SiteCertificate",
      certificateArn,
    );
    const siteOrigin =
      origins.S3BucketOrigin.withOriginAccessControl(siteBucket);
    const puzzleOrigin =
      origins.S3BucketOrigin.withOriginAccessControl(puzzleBucket);

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      certificate,
      defaultBehavior: {
        origin: siteOrigin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: randomPuzzleFunction,
          },
        ],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        "/api/puzzles/random": {
          origin: puzzleOrigin,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          compress: true,
          functionAssociations: [
            {
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
              function: randomPuzzleFunction,
            },
          ],
          responseHeadersPolicy: randomPuzzleResponseHeadersPolicy,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        "/puzzles/*": {
          origin: puzzleOrigin,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          compress: true,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
      defaultRootObject: siteDocument,
      domainNames: [domainName],
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: `/${siteDocument}`,
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: `/${siteDocument}`,
          ttl: Duration.minutes(5),
        },
      ],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
      exclude: ["puzzles/*"],
      memoryLimit: 1024,
      prune: true,
      sources: [s3deploy.Source.asset(join(projectRoot, "dist/site"))],
    });

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

    new CfnOutput(this, "BucketName", {
      value: siteBucket.bucketName,
    });
    new CfnOutput(this, "PuzzleBucketName", {
      value: puzzleBucket.bucketName,
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
  const manifestPath = join(projectRoot, "app/puzzles/manifest.json");
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

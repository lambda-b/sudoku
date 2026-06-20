# Sudoku Infrastructure

AWS CDK app for hosting this Vite SPA with S3, CloudFront, Route53, and a CloudFront Function that replaces the local Vite `/api/puzzles/random` middleware in production.

## Setup

Install dependencies:

```sh
npm --prefix infra install
```

Bootstrap the target AWS account/region once:

```sh
npm run infra:bootstrap
```

Deploy:

```sh
npm run infra:deploy
```

This builds the frontend into `dist/site` and deploys only the SPA/static site bucket.

Deploy puzzle JSON files separately:

```sh
npm run puzzles:deploy
```

This copies the source dataset from `puzzles` into `dist/puzzles`, syncs it to the puzzle bucket, and invalidates `/puzzles/*` and `/api/puzzles/random`.

## GitHub Actions

`.github/workflows/site.yml` validates pull requests. After a change is merged into `main`, it validates the same commit and deploys `dist/site` through CDK.

`.github/workflows/puzzles.yml` is started manually from the Actions tab. It deploys `dist/puzzles` to the puzzle bucket and invalidates the related CloudFront paths.

Both deployment jobs use GitHub OIDC instead of static AWS access keys. Create a GitHub Environment named `production`, then add an environment variable named `AWS_ROLE_ARN` containing the IAM role ARN that GitHub Actions should assume.

The IAM role trust policy must allow the GitHub OIDC provider with these conditions:

```json
{
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    "token.actions.githubusercontent.com:sub": "repo:lambda-b/sudoku:environment:production"
  }
}
```

The role needs permission to assume the CDK bootstrap deployment roles. It also needs `s3:ListBucket`, `s3:PutObject`, and `s3:DeleteObject` for `dancinglinks-sudoku-solver-puzzles`, plus `cloudfront:CreateInvalidation` for the site distribution.

This project defaults to:

- Domain: `sudoku.pisan-zapra.com`
- Hosted zone: `pisan-zapra.com`
- S3 bucket: `dancinglinks-sudoku-solver`
- Puzzle S3 bucket: `dancinglinks-sudoku-solver-puzzles`
- ACM certificate: `arn:aws:acm:us-east-1:154539905353:certificate/28775c3e-1141-4ef3-8a41-cde305b8d76f`

Override them when needed:

```sh
npm run infra:deploy -- \
  -c domainName=sudoku.example.com \
  -c hostedZoneName=example.com \
  -c certificateArn=arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

CloudFront certificates must be in `us-east-1`.

## Existing Manual Resources

To let CDK manage resources that already exist, import them into this stack after the first successful `cdk synth`:

```sh
npm --prefix infra run synth -- -c importExistingResources=true
npx --prefix infra cdk import -c importExistingResources=true
```

The resources to map are:

- `SudokuWebStack/SiteBucket`
- `SudokuWebStack/Distribution`
- `SudokuWebStack/RandomPuzzleFunction`
- `SudokuWebStack/Distribution/Origin1/S3OriginAccessControl`
- `SudokuWebStack/AliasRecord`
- `SudokuWebStack/AliasRecordIpv6`, if an AAAA record already exists

If you prefer replacing the manual resources instead of importing them, deploy this stack as-is, verify the new CloudFront distribution, then remove the old resources manually.

After import completes, run a normal deploy to add CloudFront Function, BucketDeployment, Route53 records, and SPA fallback settings:

```sh
npm run infra:deploy
```

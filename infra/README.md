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

This project defaults to:

- Domain: `sudoku.pisan-zapra.com`
- Hosted zone: `pisan-zapra.com`
- S3 bucket: `dancinglinks-sudoku-solver`
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
npm --prefix infra run synth
npx --prefix infra cdk import
```

The resources to map are:

- `SudokuWebStack/SiteBucket`
- `SudokuWebStack/Distribution`
- `SudokuWebStack/RandomPuzzleFunction`
- `SudokuWebStack/Distribution/Origin1/S3OriginAccessControl`
- `SudokuWebStack/AliasRecord`
- `SudokuWebStack/AliasRecordIpv6`, if an AAAA record already exists

If you prefer replacing the manual resources instead of importing them, deploy this stack as-is, verify the new CloudFront distribution, then remove the old resources manually.

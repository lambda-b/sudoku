#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { SudokuWebStack } from "../lib/sudoku-web-stack.js";

const app = new App();

new SudokuWebStack(app, "SudokuWebStack", {
  env: {
    account:
      (app.node.tryGetContext("deploymentAccount") as string | undefined) ??
      process.env.CDK_DEFAULT_ACCOUNT,
    region:
      (app.node.tryGetContext("deploymentRegion") as string | undefined) ??
      process.env.CDK_DEFAULT_REGION,
  },
});

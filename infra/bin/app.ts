#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { SudokuWebStack } from "../lib/sudoku-web-stack.js";

const app = new App();

new SudokuWebStack(app, "SudokuWebStack", {
  env: {
    account:
      process.env.CDK_DEFAULT_ACCOUNT ??
      (app.node.tryGetContext("deploymentAccount") as string | undefined),
    region:
      process.env.CDK_DEFAULT_REGION ??
      (app.node.tryGetContext("deploymentRegion") as string | undefined),
  },
});

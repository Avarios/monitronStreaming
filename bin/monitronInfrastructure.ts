#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MonitronProcessingStack } from '../lib/monitronProcessingStack';


const app = new cdk.App({ stackTraces: true, analyticsReporting: true });
const lambda = new MonitronProcessingStack(app, "montronLambdaStack", { env: { region: "us-east-1" } });

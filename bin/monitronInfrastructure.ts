#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RoleStack } from '../lib/roles';
import { MonitronStack } from '../lib/monitronStack';
import { ComputeStack } from '../lib/computeStack';
import { DlqStack } from '../lib/sqsDeadLetter';
import { KinesisConstruct } from '../lib/streamStack';

const app = new cdk.App();

const stack = new MonitronStack(app,"monitronStack");
const roles = new RoleStack(stack,"monitronRoles");
const dqlStack = new DlqStack(stack,"dlqStackMonitron",{ ConsumerRole:roles.LambdaRole })
const kinesis = new KinesisConstruct(stack,"monitronStream",{ ConsumerRole:roles.LambdaRole })
const lambda = new ComputeStack(stack,"montronLambdaStack",{ ConsumerRole:roles.LambdaRole, deadLetterQueue:dqlStack.Queue,KinesisStream:kinesis.Stream });
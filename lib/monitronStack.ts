import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MonitronStack extends Stack {
  constructor(construct: Construct, id: string, props?: StackProps) {
    super(construct, id, props);
  }
}
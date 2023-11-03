import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { KinesisEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Stack  } from 'aws-cdk-lib'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { IStream } from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';

type ComputeStackProps = {
    ConsumerRole:IRole,
    KinesisStream:IStream,
    deadLetterQueue:SqsDlq
}

export class ComputeStack extends Construct { 
    /**
     *
     */
    constructor(parent:Stack,id:string,props:ComputeStackProps) {
        super(parent,id);

        const func = new NodejsFunction(parent,"kinesisConsumer", {
            entry: "./function/index.js",
            handler:"handler",
            runtime: Runtime.NODEJS_18_X,
            role: props.ConsumerRole
        });        
        const eventSource = new KinesisEventSource(props.KinesisStream,{
                startingPosition: StartingPosition.LATEST,
                enabled:true,
                onFailure: props.deadLetterQueue
        });

        eventSource.bind(func);
    }
}
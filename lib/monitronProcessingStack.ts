import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { KinesisEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Stack, StackProps } from 'aws-cdk-lib'
import { IRole, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { IStream, Stream, StreamMode } from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class MonitronProcessingStack extends Stack {

    private lambdaRole: IRole;

    constructor(construct: Construct, id: string, props?: StackProps) {
        super(construct, id, props);

        const func = new NodejsFunction(this, "kinesisConsumer", {
            entry: "./function/index.js",
            handler: "handler",
            runtime: Runtime.NODEJS_18_X,
        });
        const queue = new Queue(this, "kinesisEventSourceDql", {
            queueName: "dlqKinesisEvents"
        });

        queue.grantSendMessages(func);


        this.lambdaRole = func.role || new Role(this, 'lambdaRole', {
            assumedBy: new ServicePrincipal("lambda")
        });


        const kinesis = new Stream(this, "MonitronStream", {
            streamName: "monitronDataStream",
            streamMode: StreamMode.ON_DEMAND
        });

        kinesis.grantRead(func);
        const eventSource = new KinesisEventSource(kinesis, {
            startingPosition: StartingPosition.LATEST,
            enabled: true,
            onFailure: new SqsDlq(queue)
        });
        eventSource.bind(func);

        const table = new Table(this, "monitronDataTable", {
            partitionKey: {
                name: "timestamp",
                type: AttributeType.STRING
            },
            sortKey: {
                name: "id",
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
        });
        func.addEnvironment("TABLE_NAME", table.tableName);
        table.grantWriteData(func);
    }


    get Role(): IRole {
        return this.lambdaRole;
    }
}
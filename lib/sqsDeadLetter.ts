
import { Stack  } from 'aws-cdk-lib'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

type SqsStackProps = {
    ConsumerRole:IRole
}

export class DlqStack extends Construct { 

    private dlq:SqsDlq;

    constructor(parent:Stack,id:string,props:SqsStackProps) {
        super(parent,id); 
    
        const queue = new Queue(parent,"kinesisEventSourceDql", {
            queueName: "dlqKinesisEvents"
        });

        this.dlq = new SqsDlq(queue);
    }


    get Queue():SqsDlq {
        return this.dlq;
    }
}
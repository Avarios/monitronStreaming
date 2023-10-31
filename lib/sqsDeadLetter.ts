
import { Stack  } from 'aws-cdk-lib'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources'
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs'

type SqsStackProps = {
    ConsumerRole:IRole
}

export class DlqStack extends Stack { 

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
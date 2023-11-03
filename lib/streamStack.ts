import { IStream, Stream, StreamMode } from 'aws-cdk-lib/aws-kinesis'
import { Stack  } from 'aws-cdk-lib'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'


type KinesisProps = {
    ConsumerRole:IRole
}

export class KinesisConstruct extends Construct {

    private stream:IStream

    constructor(parent: Stack, id: string, props:KinesisProps) {
        super(parent,id);
        
        this.stream = new Stream(parent,"MonitronStream", {
            streamName:"monitronDataStream",
            streamMode: StreamMode.ON_DEMAND
        });

        this.stream.grantRead(props.ConsumerRole);
    }

    get Stream():IStream {
        return this.stream;
    }
}
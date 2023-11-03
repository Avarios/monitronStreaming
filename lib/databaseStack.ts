import { Stack  } from 'aws-cdk-lib'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

type DatabaseProps = {
    ConsumerRole:IRole
}

export class DatabaseStack extends Construct { 
    constructor(parent:Stack,id:string,props:DatabaseProps) {
        super(parent,id);

        const table = new Table(parent,"monitronDataTable", {
            partitionKey:{
                name:"timestamp",
                type:AttributeType.STRING
            },
            sortKey: {
                name:"id",
                type:AttributeType.STRING
            },
            billingMode:BillingMode.PAY_PER_REQUEST,
        });
        table.grantWriteData(props.ConsumerRole);
    }
}
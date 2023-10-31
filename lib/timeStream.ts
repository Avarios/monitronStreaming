import { Stack  } from 'aws-cdk-lib'
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { CfnDatabase, CfnTable } from 'aws-cdk-lib/aws-timestream';

export class TimeStreamConstruct extends Stack { 

    private tableArn:string

    constructor(parent:Stack,id:string) {
        super(parent,id);

        const timeStreamService = new CfnDatabase(parent,"monitronTimeService", {
            databaseName:"monitron"
        });

        const monitronTable = new CfnTable(parent,"monitronData", {
            databaseName: timeStreamService.databaseName || "newDatabase",
            tableName:"montronData",
        });

        monitronTable.addDependency(timeStreamService);

        this.tableArn = monitronTable.attrArn;

    }

    get TableArn():string {
        return this.tableArn;
    }
}
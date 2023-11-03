
import { Stack } from 'aws-cdk-lib'
import { IRole, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs';

export class RoleStack extends Construct {
    private lambdaRole: IRole

    constructor(parent: Stack, id: string) {
        super(parent, id);


        const role = new Role(parent, "lambdaRole", {
            assumedBy: new ServicePrincipal("lambda.amazonaws.com")
        })

        this.lambdaRole = role;
    }

    get LambdaRole(): IRole {
        return this.lambdaRole;
    }
}
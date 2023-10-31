
import { Stack  } from 'aws-cdk-lib'
import { Effect, IRole, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'

export class RoleStack extends Stack { 
    private lambdaRole:IRole

    constructor(parent:Stack,id:string,monitronArn:string) {
        super(parent,id);


        const role = new Role(parent,"lambdaRole",{
            assumedBy:new ServicePrincipal("lambda.amazonaws.com")
        })

        role.addToPolicy(new PolicyStatement({
            actions:["timestream:DescribeEndpoints"],
            effect:Effect.ALLOW,
            resources:[monitronArn]
        }))

        this.lambdaRole = role;
    }

    get LambdaRole():IRole {
        return this.lambdaRole;
    }
}
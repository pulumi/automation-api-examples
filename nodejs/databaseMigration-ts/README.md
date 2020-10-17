# Database Migration

This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

This example also has a VSCode debug configuration that enables setting breakpoints within both the Automation API code, and things like `.apply` calls within the Pulumi program.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.12.0](https://www.pulumi.com/docs/get-started/install/versions/) or later) 
2. The AWS CLI, with appropriate credentials.
3. install deps: `yarn install`

Running this program is just like any other typescript program. No invocation through the Pulumi CLI required:

```shell
$ yarn start
yarn run v1.22.10
$ tsc && node ./bin/index.js
successfully initialized stack
installing plugins...
plugins installed
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev/updates/27


refresh complete
updating stack...
Updating (dev)


View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev/updates/28


 +  pulumi:pulumi:Stack databaseMigration-dev creating 

 +  awsx:x:ec2:SecurityGroup publicGroup creating 

 +  awsx:x:ec2:IngressSecurityGroupRule publicGroup-ingress-0 creating 
 +  awsx:x:ec2:EgressSecurityGroupRule publicGroup-egress-0 creating 

 +  awsx:x:ec2:Vpc default-vpc creating 

 +  awsx:x:ec2:Subnet default-vpc-public-1 creating 

 +  pulumi:pulumi:Stack databaseMigration-dev creating read aws:ec2:Subnet default-vpc-public-0
 +  awsx:x:ec2:Subnet default-vpc-public-0 creating 
 +  pulumi:pulumi:Stack databaseMigration-dev creating read aws:ec2:Subnet default-vpc-public-1
 +  pulumi:pulumi:Stack databaseMigration-dev creating read aws:ec2:Vpc default-vpc

 +  pulumi:pulumi:Stack databaseMigration-dev creating read aws:ec2:Subnet default-vpc-public-0

 +  pulumi:pulumi:Stack databaseMigration-dev creating read aws:ec2:Subnet default-vpc-public-1

 +  aws:rds:SubnetGroup dbsubnet creating 

 +  pulumi:pulumi:Stack databaseMigration-dev creating read aws:ec2:Vpc default-vpc

 +  aws:rds:SubnetGroup dbsubnet created 

 +  aws:ec2:SecurityGroup publicGroup creating 

 +  aws:ec2:SecurityGroup publicGroup created 

 +  aws:ec2:SecurityGroupRule publicGroup-ingress-0 creating 
 +  aws:ec2:SecurityGroupRule publicGroup-egress-0 creating 

 +  aws:rds:Cluster db creating 

 +  aws:ec2:SecurityGroupRule publicGroup-ingress-0 created 

 +  aws:ec2:SecurityGroupRule publicGroup-egress-0 created 

@ Updating....
.

 +  aws:rds:Cluster db created 

 +  aws:rds:ClusterInstance dbInstance creating 

@ Updating....
.

 +  aws:rds:ClusterInstance dbInstance created 

 +  pulumi:pulumi:Stack databaseMigration-dev created 
 

Outputs:
    dbName: "hellosql"
    dbPass: "hellosql"
    dbUser: "hellosql"
    host  : "tf-20201017175104932600000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"


Resources:
    + 13 created

Duration: 4m53s


update summary: 
{
    "create": 13
}
db host url: tf-20201017175104932600000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com
configuring db...
creating table...
table created!
Result:  {"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
seeding initial data...
rows inserted!
Result:  {"fieldCount":0,"affectedRows":3,"insertId":0,"serverStatus":2,"warningCount":0,"message":"&Records: 3  Duplicates: 0  Warnings: 0","protocol41":true,"changedRows":0}
querying to veryify data...
Result:  [{"COUNT(*)":3}]
database, tables, and rows successfuly configured!
✨  Done in 308.85s.

```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ yarn start destroy
yarn run v1.22.10
$ tsc && node ./bin/index.js destroy
successfully initialized stack
installing plugins...
plugins installed
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev/updates/29




 ~  awsx:x:ec2:SecurityGroup publicGroup refreshing 

 ~  awsx:x:ec2:EgressSecurityGroupRule publicGroup-egress-0 refreshing 
 ~  awsx:x:ec2:IngressSecurityGroupRule publicGroup-ingress-0 refreshing 

    awsx:x:ec2:SecurityGroup publicGroup  

    awsx:x:ec2:IngressSecurityGroupRule publicGroup-ingress-0  
 ~  pulumi:pulumi:Stack databaseMigration-dev refreshing 

    pulumi:pulumi:Stack databaseMigration-dev running 
 ~  awsx:x:ec2:Vpc default-vpc refreshing 
    awsx:x:ec2:Vpc default-vpc  

    awsx:x:ec2:EgressSecurityGroupRule publicGroup-egress-0  
 ~  awsx:x:ec2:Subnet default-vpc-public-1 refreshing 
    awsx:x:ec2:Subnet default-vpc-public-1  

 ~  awsx:x:ec2:Subnet default-vpc-public-0 refreshing 
    awsx:x:ec2:Subnet default-vpc-public-0  

 ~  aws:ec2:SecurityGroupRule publicGroup-ingress-0 refreshing 

 ~  aws:ec2:Subnet default-vpc-public-0 refreshing 

 ~  aws:ec2:Subnet default-vpc-public-1 refreshing 

 ~  aws:ec2:SecurityGroup publicGroup refreshing 

 ~  aws:ec2:Vpc default-vpc refreshing 

 ~  aws:rds:SubnetGroup dbsubnet refreshing 

 ~  aws:ec2:SecurityGroupRule publicGroup-egress-0 refreshing 

 ~  aws:rds:ClusterInstance dbInstance refreshing 

 ~  aws:rds:Cluster db refreshing 

    aws:ec2:Subnet default-vpc-public-0  [diff: +assignIpv6AddressOnCreation,availabilityZone,availabilityZoneId,cidrBlock,ipv6CidrBlock,mapPublicIpOnLaunch,outpostArn,tags,vpcId]

 ~  aws:ec2:SecurityGroup publicGroup updated [diff: +egress,ingress,namePrefix,tags]

    aws:ec2:Subnet default-vpc-public-1  [diff: +assignIpv6AddressOnCreation,availabilityZone,availabilityZoneId,cidrBlock,ipv6CidrBlock,mapPublicIpOnLaunch,outpostArn,tags,vpcId]

 ~  aws:ec2:SecurityGroupRule publicGroup-egress-0 updated [diff: +description,ipv6CidrBlocks,prefixListIds]

 ~  aws:ec2:SecurityGroupRule publicGroup-ingress-0 updated [diff: +description,ipv6CidrBlocks,prefixListIds]

    aws:rds:SubnetGroup dbsubnet  [diff: +tags]

 ~  aws:rds:Cluster db updated [diff: +availabilityZones,backtrackWindow,clusterIdentifier,clusterMembers,dbClusterParameterGroupName,deletionProtection,enabledCloudwatchLogsExports,globalClusterIdentifier,iamDatabaseAuthenticationEnabled,iamRoles,kmsKeyId,port,preferredBackupWindow,preferredMaintenanceWindow,replicationSourceIdentifier,storageEncrypted,tags]

    aws:rds:ClusterInstance dbInstance  [diff: +availabilityZone,caCertIdentifier,dbParameterGroupName,identifier,monitoringRoleArn,performanceInsightsEnabled,performanceInsightsKmsKeyId,preferredBackupWindow,preferredMaintenanceWindow,tags]

    aws:ec2:Vpc default-vpc  [diff: +assignGeneratedIpv6CidrBlock,cidrBlock,enableClassiclink,enableClassiclinkDnsSupport,enableDnsHostnames,enableDnsSupport,instanceTenancy,tags]

    pulumi:pulumi:Stack databaseMigration-dev  
 

Outputs:
    dbName: "hellosql"
    dbPass: "hellosql"
    dbUser: "hellosql"
    host  : "tf-20201017175104932600000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"


Resources:
    ~ 4 updated
    12 unchanged

Duration: 2s


refresh complete
destroying stack...
Destroying (dev)


View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev/updates/30




 -  aws:rds:ClusterInstance dbInstance deleting 

@ Destroying....
.
.
.
.

 -  aws:rds:ClusterInstance dbInstance deleted 

 -  aws:rds:Cluster db deleting 

@ Destroying....
.
.

 -  aws:rds:Cluster db deleted 

 -  aws:ec2:SecurityGroupRule publicGroup-ingress-0 deleting 

 -  aws:rds:SubnetGroup dbsubnet deleting 

 -  aws:ec2:SecurityGroupRule publicGroup-egress-0 deleting 

 -  aws:rds:SubnetGroup dbsubnet deleted 

 -  aws:ec2:SecurityGroupRule publicGroup-ingress-0 deleted 

 -  aws:ec2:SecurityGroupRule publicGroup-egress-0 deleted 

 -  awsx:x:ec2:Subnet default-vpc-public-1 deleting 
 -  awsx:x:ec2:IngressSecurityGroupRule publicGroup-ingress-0 deleting 

 -  awsx:x:ec2:Subnet default-vpc-public-0 deleting 
 -  awsx:x:ec2:EgressSecurityGroupRule publicGroup-egress-0 deleting 

 -  aws:ec2:SecurityGroup publicGroup deleting 

 -  aws:ec2:SecurityGroup publicGroup deleted 

 -  awsx:x:ec2:Vpc default-vpc deleting 

 -  awsx:x:ec2:SecurityGroup publicGroup deleting 

 -  pulumi:pulumi:Stack databaseMigration-dev deleting 

 -  awsx:x:ec2:Subnet default-vpc-public-0 deleted 
 -  awsx:x:ec2:EgressSecurityGroupRule publicGroup-egress-0 deleted 

 -  awsx:x:ec2:Vpc default-vpc deleted 
 -  awsx:x:ec2:SecurityGroup publicGroup deleted 
 -  pulumi:pulumi:Stack databaseMigration-dev deleted 
 -  awsx:x:ec2:Subnet default-vpc-public-1 deleted 
 -  awsx:x:ec2:IngressSecurityGroupRule publicGroup-ingress-0 deleted 
 
Outputs:
  - dbName: "hellosql"
  - dbPass: "hellosql"
  - dbUser: "hellosql"
  - host  : "tf-20201017175104932600000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    - 13 deleted

Duration: 2m47s


The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run 'pulumi stack rm dev'.

stack destroy complete
✨  Done in 182.96s.
```

## Debugging

This project includes VSCode debug configuration. Open VSCode from this directory and `F5` to start debugging, including `.apply` calls within the pulumi program itself. Give it a try!
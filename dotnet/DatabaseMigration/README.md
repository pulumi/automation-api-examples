# Database Migration

This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 6.0.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

```shell
C:\code\pulumi-automation-examples\DatabaseMigration> dotnet run
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/database_migration_project/dev/updates/17



Resources:

Duration: 0s

refresh complete
updating stack...
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://0.0.0.0:56129
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\git\pulumi-automation-examples\dotnet\DatabaseMigration
Updating (dev)

View Live: https://app.pulumi.com/joshstudt/database_migration_project/dev/updates/18

info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:56129/pulumirpc.LanguageRuntime/GetRequiredPlugins application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'

info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 157.5021ms 200 application/grpc
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:56129/pulumirpc.LanguageRuntime/Run application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
 +  pulumi:pulumi:Stack database_migration_project-dev creating
 +  aws:ec2:SecurityGroup public-security-group creating
 +  aws:rds:SubnetGroup db-subnet creating
 +  aws:ec2:SecurityGroup public-security-group created
 +  aws:rds:SubnetGroup db-subnet created
 +  aws:rds:Cluster db creating
 +  aws:rds:Cluster db created
 +  aws:rds:ClusterInstance db-instance creating
 +  aws:rds:ClusterInstance db-instance created
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 298030.4372ms 200 application/grpc
 +  pulumi:pulumi:Stack database_migration_project-dev created

Outputs:
    db_name: "hellosql"
    db_pass: "hellosql"
    db_user: "hellosql"
    host   : "tf-20210302154117369900000001.cluster-cybcaqnrwvmo.us-west-2.rds.amazonaws.com"

Resources:
    + 5 created

Duration: 4m59s

info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
update summary:
    Create: 5
db host url: tf-20210302154117369900000001.cluster-cybcaqnrwvmo.us-west-2.rds.amazonaws.com
configuring db...
db configured!
rows inserted!
querying to verify data...
Result: 3 rows
database, table, and rows successfully configured
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
C:\code\pulumi-automation-examples\DatabaseMigration> dotnet run destroy
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/database_migration_project/dev/updates/19


 ~  pulumi:pulumi:Stack database_migration_project-dev refreshing
    pulumi:pulumi:Stack database_migration_project-dev running
 ~  aws:rds:SubnetGroup db-subnet refreshing
 ~  aws:ec2:SecurityGroup public-security-group refreshing
 ~  aws:rds:Cluster db refreshing
 ~  aws:rds:ClusterInstance db-instance refreshing
    aws:ec2:SecurityGroup public-security-group  [diff: +namePrefix,tags,vpcId~egress,ingress]
    aws:rds:SubnetGroup db-subnet  [diff: +tags]
 ~  aws:rds:Cluster db updated [diff: +availabilityZones,backtrackWindow,clusterIdentifier,clusterMembers,dbClusterParameterGroupName,deletionProtection,enabledCloudwatchLogsExports,globalClusterIdentifier,iamDatabaseAuthenticationEnabled,iamRoles,kmsKeyId,port,preferredBackupWindow,preferredMaintenanceWindow,replicationSourceIdentifier,storageEncrypted,tags~masterPassword]
    aws:rds:ClusterInstance db-instance  [diff: +availabilityZone,caCertIdentifier,dbParameterGroupName,identifier,monitoringRoleArn,performanceInsightsEnabled,performanceInsightsKmsKeyId,preferredBackupWindow,preferredMaintenanceWindow,tags]
    pulumi:pulumi:Stack database_migration_project-dev

Outputs:
    db_name: "hellosql"
    db_pass: "hellosql"
    db_user: "hellosql"
    host   : "tf-20210302154117369900000001.cluster-cybcaqnrwvmo.us-west-2.rds.amazonaws.com"

Resources:
    ~ 1 updated
    4 unchanged

Duration: 2s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/joshstudt/database_migration_project/dev/updates/20


 -  aws:rds:ClusterInstance db-instance deleting
 -  aws:rds:ClusterInstance db-instance deleted
 -  aws:rds:Cluster db deleting
 -  aws:rds:Cluster db deleted
 -  aws:rds:SubnetGroup db-subnet deleting
 -  aws:ec2:SecurityGroup public-security-group deleting
 -  aws:rds:SubnetGroup db-subnet deleted
 -  aws:ec2:SecurityGroup public-security-group deleted
 -  pulumi:pulumi:Stack database_migration_project-dev deleting
 -  pulumi:pulumi:Stack database_migration_project-dev deleted

Outputs:
  - db_name: "hellosql"
  - db_pass: "hellosql"
  - db_user: "hellosql"
  - host   : "tf-20210302154117369900000001.cluster-cybcaqnrwvmo.us-west-2.rds.amazonaws.com"

Resources:
    - 5 deleted

Duration: 2m41s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```

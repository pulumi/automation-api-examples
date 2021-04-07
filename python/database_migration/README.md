# Database Migration

This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

First, set up your virtual environment:
1. ```shell
   $ python3 -m venv venv
   ```
2. ```shell
   $ venv/bin/python3 -m pip install --upgrade pip
   ```
3. ```shell
   $ venv/bin/pip install -r requirements.txt
   ```
Running this program is just like any other python program. No invocation through the Pulumi CLI required:

```shell
$ venv/bin/python main.py
successfully initialized stack
installing plugins...
plugins installed
setting up config
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/komalali/database_migration/dev/updates/15



Resources:

Duration: 1s

refresh complete
updating stack...
Updating (dev)

View Live: https://app.pulumi.com/komalali/database_migration/dev/updates/16


+  pulumi:pulumi:Stack database_migration-dev creating
+  aws:ec2:SecurityGroup public_group creating
+  aws:rds:SubnetGroup db_subnet creating
+  aws:rds:SubnetGroup db_subnet created
+  aws:ec2:SecurityGroup public_group created
+  aws:rds:Cluster db creating
+  aws:rds:Cluster db created
+  aws:rds:ClusterInstance db_instance creating
+  aws:rds:ClusterInstance db_instance created
+  pulumi:pulumi:Stack database_migration-dev created

Outputs:
db_name: "hellosql"
db_pass: "hellosql"
db_user: "hellosql"
host   : "db-7b02df4.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
+ 5 created

Duration: 4m24s

update summary: 
{
    "create": 5
}
db host url: db-7b02df4.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com
configuring db...
db configured!
creating table...
rows inserted!
querying to verify data...
Result: [3]
database, table and rows successfully configured


```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ venv/bin/python main.py destroy
successfully initialized stack
installing plugins...
plugins installed
setting up config
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/komalali/database_migration/dev/updates/17


~  pulumi:pulumi:Stack database_migration-dev refreshing
pulumi:pulumi:Stack database_migration-dev running
~  aws:rds:SubnetGroup db_subnet refreshing
~  aws:ec2:SecurityGroup public_group refreshing
~  aws:rds:ClusterInstance db_instance refreshing
~  aws:rds:Cluster db refreshing
aws:ec2:SecurityGroup public_group  [diff: +namePrefix,tags,vpcId~egress,ingress]
aws:rds:SubnetGroup db_subnet  [diff: +tags]
~  aws:rds:Cluster db updated [diff: +availabilityZones,backtrackWindow,clusterMembers,dbClusterParameterGroupName,deletionProtection,enabledCloudwatchLogsExports,globalClusterIdentifier,iamDatabaseAuthenticationEnabled,iamRoles,kmsKeyId,port,preferredBackupWindow,preferredMaintenanceWindow,replicationSourceIdentifier,storageEncrypted,tags~masterPassword]
aws:rds:ClusterInstance db_instance  [diff: +availabilityZone,caCertIdentifier,dbParameterGroupName,identifier,monitoringRoleArn,performanceInsightsEnabled,performanceInsightsKmsKeyId,preferredBackupWindow,preferredMaintenanceWindow,tags]
pulumi:pulumi:Stack database_migration-dev

Outputs:
db_name: "hellosql"
db_pass: "hellosql"
db_user: "hellosql"
host   : "db-7b02df4.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
~ 1 updated
4 unchanged

Duration: 2s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/komalali/database_migration/dev/updates/18


-  aws:rds:ClusterInstance db_instance deleting
-  aws:rds:ClusterInstance db_instance deleted
-  aws:rds:Cluster db deleting
-  aws:rds:Cluster db deleted
-  aws:rds:SubnetGroup db_subnet deleting
-  aws:ec2:SecurityGroup public_group deleting
-  aws:rds:SubnetGroup db_subnet deleted
-  aws:ec2:SecurityGroup public_group deleted
-  pulumi:pulumi:Stack database_migration-dev deleting
-  pulumi:pulumi:Stack database_migration-dev deleted

Outputs:
- db_name: "hellosql"
- db_pass: "hellosql"
- db_user: "hellosql"
- host   : "db-7b02df4.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
- 5 deleted

Duration: 4m38s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```

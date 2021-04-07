# Database Migration

This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go destroy
Created/Selected stack "dev1"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev1)

View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev1/updates/12


 -  aws:rds:ClusterInstance dbInstance deleting
@ Destroying.........
 -  aws:rds:ClusterInstance dbInstance deleted
 -  aws:rds:Cluster db deleting
@ Destroying......
 -  aws:rds:Cluster db deleted
 -  aws:rds:SubnetGroup dbsubnet deleting
 -  aws:ec2:SecurityGroup web-sg deleting
 -  aws:rds:SubnetGroup dbsubnet deleted
 -  aws:ec2:SecurityGroup web-sg deleted
 -  pulumi:pulumi:Stack databaseMigration-dev1 deleting
 -  pulumi:pulumi:Stack databaseMigration-dev1 deleted

Outputs:
  - dbName: "hellosql"
  - dbPass: "hellosql"
  - dbUser: "hellosql"
  - host  : "tf-20201017184456962100000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    - 5 deleted

Duration: 3m5s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev1'.
Stack successfully destroyed
Evans-MBP:database_migration evanboyle$ go run main.go
Created/Selected stack "dev1"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Updating (dev1)

View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev1/updates/14


 +  pulumi:pulumi:Stack databaseMigration-dev1 creating
 +  aws:rds:SubnetGroup dbsubnet creating
 +  aws:ec2:SecurityGroup web-sg creating
 +  aws:rds:SubnetGroup dbsubnet created
 +  aws:ec2:SecurityGroup web-sg created
 +  aws:rds:Cluster db creating
@ Updating......
 +  aws:rds:Cluster db created
 +  aws:rds:ClusterInstance dbInstance creating
@ Updating................
 +  aws:rds:ClusterInstance dbInstance created
 +  pulumi:pulumi:Stack databaseMigration-dev1 created

Outputs:
    dbName: "hellosql"
    dbPass: "hellosql"
    dbUser: "hellosql"
    host  : "tf-20201017191414467100000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    + 5 created

Duration: 5m21s

Update succeeded!
host: tf-20201017191414467100000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com
creating table...
table created!
inserting initial rows...
rows inserted!
querying to verify data...
3 rows read!
database, tables, and rows successfuly configured!
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Created/Selected stack "dev1"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev1)

View Live: https://app.pulumi.com/EvanBoyle/databaseMigration/dev1/updates/16


 -  aws:rds:ClusterInstance dbInstance deleting
@ Destroying........
 -  aws:rds:ClusterInstance dbInstance deleted
 -  aws:rds:Cluster db deleting
@ Destroying......
 -  aws:rds:Cluster db deleted
 -  aws:rds:SubnetGroup dbsubnet deleting
 -  aws:ec2:SecurityGroup web-sg deleting
 -  aws:rds:SubnetGroup dbsubnet deleted
 -  aws:ec2:SecurityGroup web-sg deleted
 -  pulumi:pulumi:Stack databaseMigration-dev1 deleting
 -  pulumi:pulumi:Stack databaseMigration-dev1 deleted

Outputs:
  - dbName: "hellosql"
  - dbPass: "hellosql"
  - dbUser: "hellosql"
  - host  : "tf-20201017191414467100000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    - 5 deleted

Duration: 2m55s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev1'.
Stack successfully destroyed
```

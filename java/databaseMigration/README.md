# Database Migration

This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

To run this example you'll need a few pre-reqs:
1. [A Pulumi CLI installation (v3.149.0 or later)](https://www.pulumi.com/docs/iac/download-install/).
2. [AWS CLI and credentials](https://www.pulumi.com/docs/iac/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account).
3. [Java 11 or later](https://www.oracle.com/java/technologies/downloads).
4. [Maven 3.6.1 or later](https://maven.apache.org/install.html), to install dependencies, build, and run the Java program.


Running this program is just like any other Java program with Maven. You can run `mvn -q compile exec:java` from the project directory.


```shell
$ mvn -q compile exec:java
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/user/database_migration_project/dev/updates/1


Resources:

Duration: 1s

refresh complete
updating stack...
Updating (dev)

View Live: https://app.pulumi.com/user/database_migration_project/dev/updates/2


@ Updating.....
 +  pulumi:pulumi:Stack database_migration_project-dev creating (0s)
 +  aws:ec2:SecurityGroup public-security-group creating (0s)
@ Updating....
 +  aws:rds:SubnetGroup db-subnet creating (0s)
@ Updating....
 +  aws:rds:SubnetGroup db-subnet created (1s)
@ Updating....
 +  aws:ec2:SecurityGroup public-security-group created (2s)
 +  aws:rds:Cluster db creating (0s)
@ Updating.......................................................
 +  aws:rds:Cluster db created (51s)
 +  aws:rds:ClusterInstance db-instance creating (0s)
@ Updating..........................................................................................................................................................................................................................................................................................................................................................................................................................
 +  aws:rds:ClusterInstance db-instance created (406s)
@ Updating....
 +  pulumi:pulumi:Stack database_migration_project-dev created (462s)
Outputs:
    db_name: "hellosql"
    db_pass: "hellosql"
    db_user: "hellosql"
    host   : "tf-20250210030519737400000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    + 5 created

Duration: 7m45s

update summary:
    CREATE: $d
db host url: tf-20250210030519737400000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com
configuring db...
db configured!
rows inserted!
querying to verify data...
Result: 3 rows
database, table, and rows successfully configured
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ mvn -q compile exec:java -Dexec.args="destroy"
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/user/database_migration_project/dev/updates/3


@ Refreshing....
 ~  pulumi:pulumi:Stack database_migration_project-dev refreshing (0s)
 ~  aws:rds:SubnetGroup db-subnet refreshing (0s)
 ~  aws:ec2:SecurityGroup public-security-group refreshing (0s)
 ~  aws:rds:ClusterInstance db-instance refreshing (0s)
    pulumi:pulumi:Stack database_migration_project-dev running
 ~  aws:rds:Cluster db refreshing (0s)
    aws:ec2:SecurityGroup public-security-group
@ Refreshing....
    aws:rds:Cluster db
    aws:rds:SubnetGroup db-subnet
    aws:rds:ClusterInstance db-instance
    pulumi:pulumi:Stack database_migration_project-dev
Outputs:
    db_name: "hellosql"
    db_pass: "hellosql"
    db_user: "hellosql"
    host   : "tf-20250210030519737400000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    5 unchanged

Duration: 3s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/user/database_migration_project/dev/updates/4


 -  aws:rds:ClusterInstance db-instance deleting (0s)
@ Destroying...........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
 -  aws:rds:ClusterInstance db-instance deleted (679s)
 -  aws:rds:Cluster db deleting (0s)
@ Destroying......................................................
 -  aws:rds:Cluster db deleted (50s)
 -  aws:rds:SubnetGroup db-subnet deleting (0s)
 -  aws:ec2:SecurityGroup public-security-group deleting (0s)
 -  aws:rds:SubnetGroup db-subnet deleted (0.21s)
@ Destroying....
 -  aws:ec2:SecurityGroup public-security-group deleted (0.92s)
 -  pulumi:pulumi:Stack database_migration_project-dev deleting (0s)
 -  pulumi:pulumi:Stack database_migration_project-dev deleted (0.09s)
Outputs:
  - db_name: "hellosql"
  - db_pass: "hellosql"
  - db_user: "hellosql"
  - host   : "tf-20250210030519737400000001.cluster-chuqccm8uxqx.us-west-2.rds.amazonaws.com"

Resources:
    - 5 deleted

Duration: 12m13s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run `pulumi stack rm dev`.
stack destroy complete
```

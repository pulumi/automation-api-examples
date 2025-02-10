# Local Program

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation driver in `./automation` that contains a Java console application that can be invoked to perform the full deployment lifecycle including automatically selecting creating/selecting stacks, setting config, update, refresh, etc. Our project layout looks like the following:

- `/automation`: a Java console application containing our Automation API deployment driver. This can be run like any normal Java application using: `mvn exec:java`
- `/website`: a Pulumi program using the Java runtime, which deploys a simple static website.

To run this example you'll need a few pre-reqs:
1. [A Pulumi CLI installation (v3.149.0 or later)](https://www.pulumi.com/docs/iac/download-install/).
2. [AWS CLI and credentials](https://www.pulumi.com/docs/iac/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account).
3. [Java 11 or later](https://www.oracle.com/java/technologies/downloads).
4. [Maven 3.6.1 or later](https://maven.apache.org/install.html), to install dependencies, build, and run the Java program.

Running this program is just like any other Java console application. You can run `mvn exec:java` from the project directory, or you could run the resulting `.jar` directly from the `target` directory.

```shell
$ mvn exec:java
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< com.pulumi:LocalProgram >-----------------------
[INFO] Building LocalProgram 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.0.0:java (default-cli) @ LocalProgram ---
Successfully initialized stack
Setting up config...
Config set
Refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/website/dev/updates/1

@ Refreshing....

Resources:

Duration: 1s

Refresh complete
Updating stack...
Updating (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/website/dev/updates/2

@ Updating....

@ Updating....
 +  pulumi:pulumi:Stack website-dev creating (0s)
@ Updating.....
 +  aws:s3:BucketV2 s3-website-bucket creating (0s)
@ Updating.....
 +  aws:s3:BucketV2 s3-website-bucket created (1s)
 +  aws:s3:BucketOwnershipControls ownershipControls creating (0s)
 +  aws:s3:BucketWebsiteConfigurationV2 website creating (0s)
 +  aws:s3:BucketPublicAccessBlock publicAccessBlock creating (0s)
@ Updating....
 +  aws:s3:BucketWebsiteConfigurationV2 website created (0.55s)
 +  aws:s3:BucketOwnershipControls ownershipControls created (0.65s)
 +  aws:s3:BucketPublicAccessBlock publicAccessBlock created (0.82s)
 +  aws:s3:BucketObject index.html creating (0s)
 +  aws:s3:BucketObject index.html created (0.26s)
@ Updating....
 +  pulumi:pulumi:Stack website-dev created (5s)
Outputs:
    website_url: "http://s3-website-bucket-ad37252.s3-website-us-west-2.amazonaws.com"

Resources:
    + 6 created

Duration: 8s

Update summary:
    CREATE: 6
Website URL: http://s3-website-bucket-ad37252.s3-website-us-west-2.amazonaws.com
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  14.321 s
[INFO] Finished at: 2025-02-10T01:14:40-08:00
[INFO] ------------------------------------------------------------------------
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ mvn exec:java -Dexec.args="destroy"
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< com.pulumi:LocalProgram >-----------------------
[INFO] Building LocalProgram 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.0.0:java (default-cli) @ LocalProgram ---
Successfully initialized stack
Setting up config...
Config set
Refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/website/dev/updates/3

@ Refreshing....

 ~  pulumi:pulumi:Stack website-dev refreshing (0s)
 ~  aws:s3:BucketWebsiteConfigurationV2 website refreshing (0s)
 ~  aws:s3:BucketOwnershipControls ownershipControls refreshing (0s)
 ~  aws:s3:BucketPublicAccessBlock publicAccessBlock refreshing (0s)
    pulumi:pulumi:Stack website-dev running
 ~  aws:s3:BucketV2 s3-website-bucket refreshing (0s)
 ~  aws:s3:BucketObject index.html refreshing (0s)
@ Refreshing....
    aws:s3:BucketPublicAccessBlock publicAccessBlock
    aws:s3:BucketWebsiteConfigurationV2 website
    aws:s3:BucketObject index.html
    aws:s3:BucketOwnershipControls ownershipControls
@ Refreshing....
    aws:s3:BucketV2 s3-website-bucket
    pulumi:pulumi:Stack website-dev
Outputs:
    website_url: "http://s3-website-bucket-ad37252.s3-website-us-west-2.amazonaws.com"

Resources:
    6 unchanged

Duration: 2s

Refresh complete
Destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/website/dev/updates/4

@ Destroying....

 -  aws:s3:BucketObject index.html deleting (0s)
@ Destroying....
 -  aws:s3:BucketObject index.html deleted (0.36s)
 -  aws:s3:BucketOwnershipControls ownershipControls deleting (0s)
 -  aws:s3:BucketPublicAccessBlock publicAccessBlock deleting (0s)
 -  aws:s3:BucketWebsiteConfigurationV2 website deleting (0s)
 -  aws:s3:BucketWebsiteConfigurationV2 website deleted (0.43s)
 -  aws:s3:BucketOwnershipControls ownershipControls deleted (0.56s)
@ Destroying....
 -  aws:s3:BucketPublicAccessBlock publicAccessBlock deleted (0.78s)
 -  aws:s3:BucketV2 s3-website-bucket deleting (0s)
 -  aws:s3:BucketV2 s3-website-bucket deleted (0.47s)
 -  pulumi:pulumi:Stack website-dev deleting (0s)
@ Destroying....
 -  pulumi:pulumi:Stack website-dev deleted (0.19s)
Outputs:
  - website_url: "http://s3-website-bucket-ad37252.s3-website-us-west-2.amazonaws.com"

Resources:
    - 6 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run `pulumi stack rm dev`.
Stack destroy complete
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  11.015 s
[INFO] Finished at: 2025-02-10T01:14:57-08:00
[INFO] ------------------------------------------------------------------------
```

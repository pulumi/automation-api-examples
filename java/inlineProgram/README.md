# Inline Program

This program demonstrates how to use Automation API with an `inline` Pulumi program. Unlike traditional Pulumi programs, inline functions don't require a separate package on disk, with a Java Pulumi project and `Pulumi.yaml`. Inline programs are just functions, can be authored in the same Java package or be imported from another package. This example deploys an AWS S3 website, with all the context and deployment automation defined in a single file.

To run this example you'll need a few pre-reqs:
1. [A Pulumi CLI installation (v3.158.0 or later)](https://www.pulumi.com/docs/iac/get-started/aws/begin/#install-pulumi)
2. [AWS CLI and credentials](https://www.pulumi.com/docs/iac/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account).
3. [Java 15 or later](https://www.oracle.com/java/technologies/downloads).
4. [Maven 3.6.1 or later](https://maven.apache.org/install.html), to install dependencies, build, and run the Java program.

Running this program is just like any other Java console application. You can run `mvn exec:java` from the project directory, or you could run the resulting `.jar` directly from the `target` directory.

```shell
$ mvn install
$ mvn exec:java
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< com.pulumi:InlineProgram >----------------------
[INFO] Building InlineProgram 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.0.0:java (default-cli) @ InlineProgram ---
Successfully initialized stack
Installing plugins...
Plugins installed
Setting up config...
Config set
Refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/inline_s3_project_java/dev/updates/1


Resources:

Duration: 1s

Refresh complete
Updating stack...
Updating (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/inline_s3_project_java/dev/updates/2


 +  pulumi:pulumi:Stack inline_s3_project_java-dev creating (0s)
@ Updating.....
 +  aws:s3:BucketV2 s3-website-bucket creating (0s)
@ Updating.....
 +  aws:s3:BucketV2 s3-website-bucket created (1s)
 +  aws:s3:BucketWebsiteConfigurationV2 website creating (0s)
 +  aws:s3:BucketOwnershipControls ownershipControls creating (0s)
 +  aws:s3:BucketPublicAccessBlock publicAccessBlock creating (0s)
 +  aws:s3:BucketWebsiteConfigurationV2 website created (0.50s)
 +  aws:s3:BucketPublicAccessBlock publicAccessBlock created (0.82s)
@ Updating....
 +  aws:s3:BucketOwnershipControls ownershipControls created (0.86s)
 +  aws:s3:BucketObject index.html creating (0s)
 +  aws:s3:BucketObject index.html created (0.30s)
@ Updating....
 +  pulumi:pulumi:Stack inline_s3_project_java-dev created (5s)
Outputs:
    website_url: "http://s3-website-bucket-19d4d16.s3-website-us-west-2.amazonaws.com"

Resources:
    + 6 created

Duration: 6s

Update summary:
    CREATE: 6
Website URL: http://s3-website-bucket-19d4d16.s3-website-us-west-2.amazonaws.com
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  11.165 s
[INFO] Finished at: 2025-02-08T18:53:33-08:00
[INFO] ------------------------------------------------------------------------
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ mvn exec:java -Dexec.args="destroy"
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< com.pulumi:InlineProgram >----------------------
[INFO] Building InlineProgram 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.0.0:java (default-cli) @ InlineProgram ---
Successfully initialized stack
Installing plugins...
Plugins installed
Setting up config...
Config set
Refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/inline_s3_project_java/dev/updates/3


@ Refreshing....
 ~  pulumi:pulumi:Stack inline_s3_project_java-dev refreshing (0s)
 ~  aws:s3:BucketPublicAccessBlock publicAccessBlock refreshing (0s)
 ~  aws:s3:BucketWebsiteConfigurationV2 website refreshing (0s)
 ~  aws:s3:BucketOwnershipControls ownershipControls refreshing (0s)
 ~  aws:s3:BucketObject index.html refreshing (0s)
 ~  aws:s3:BucketV2 s3-website-bucket refreshing (0s)
    pulumi:pulumi:Stack inline_s3_project_java-dev running
    aws:s3:BucketPublicAccessBlock publicAccessBlock
    aws:s3:BucketOwnershipControls ownershipControls
    aws:s3:BucketObject index.html
    aws:s3:BucketWebsiteConfigurationV2 website
@ Refreshing....
    aws:s3:BucketV2 s3-website-bucket
    pulumi:pulumi:Stack inline_s3_project_java-dev
Outputs:
    website_url: "http://s3-website-bucket-19d4d16.s3-website-us-west-2.amazonaws.com"

Resources:
    6 unchanged

Duration: 3s

Refresh complete
Destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/troy-pulumi-corp/inline_s3_project_java/dev/updates/4


 -  aws:s3:BucketObject index.html deleting (0s)
@ Destroying....
 -  aws:s3:BucketObject index.html deleted (0.40s)
 -  aws:s3:BucketOwnershipControls ownershipControls deleting (0s)
 -  aws:s3:BucketPublicAccessBlock publicAccessBlock deleting (0s)
 -  aws:s3:BucketWebsiteConfigurationV2 website deleting (0s)
 -  aws:s3:BucketWebsiteConfigurationV2 website deleted (0.58s)
 -  aws:s3:BucketOwnershipControls ownershipControls deleted (0.66s)
 -  aws:s3:BucketPublicAccessBlock publicAccessBlock deleted (0.68s)
@ Destroying....
 -  aws:s3:BucketV2 s3-website-bucket deleting (0s)
 -  aws:s3:BucketV2 s3-website-bucket deleted (0.47s)
 -  pulumi:pulumi:Stack inline_s3_project_java-dev deleting (0s)
@ Destroying....
 -  pulumi:pulumi:Stack inline_s3_project_java-dev deleted (0.09s)
Outputs:
  - website_url: "http://s3-website-bucket-19d4d16.s3-website-us-west-2.amazonaws.com"

Resources:
    - 6 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run `pulumi stack rm dev`.
Stack destroy complete
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  9.997 s
[INFO] Finished at: 2025-02-08T18:56:35-08:00
[INFO] ------------------------------------------------------------------------
```

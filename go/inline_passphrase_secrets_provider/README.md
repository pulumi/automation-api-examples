# Inline Program

This program demonstrates how to use Automation API with an `inline` Pulumi program and custom secrets provider. This example builds on the basic example in `inline_program`
but uses a custom secrets provider, which requires saving the secrets provider configuration and re-using it on subsequent runs.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ mkdir ~/.pulumi-local
$ go run main.go
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineS3Project/dev/updates/22


 +  pulumi:pulumi:Stack inlineS3Project-dev creating
 +  aws:s3:Bucket s3-website-bucket creating
 +  aws:s3:Bucket s3-website-bucket created
 +  aws:s3:BucketObject index creating
 +  aws:s3:BucketPolicy bucketPolicy creating
 +  aws:s3:BucketObject index created
 +  aws:s3:BucketPolicy bucketPolicy created
 +  pulumi:pulumi:Stack inlineS3Project-dev created

Outputs:
    secretValue: "[secret]"
    websiteUrl : "s3-website-bucket-bf7e357.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 10s

Update succeeded!
URL: s3-website-bucket-bf7e357.s3-website-us-west-2.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineS3Project/dev/updates/24


 -  aws:s3:BucketPolicy bucketPolicy deleting
 -  aws:s3:BucketObject index deleting
 -  aws:s3:BucketObject index deleted
 -  aws:s3:BucketPolicy bucketPolicy deleted
 -  aws:s3:Bucket s3-website-bucket deleting
 -  aws:s3:Bucket s3-website-bucket deleted
 -  pulumi:pulumi:Stack inlineS3Project-dev deleting
 -  pulumi:pulumi:Stack inlineS3Project-dev deleted

Outputs:
  - secretValue: "[secret]"
  - websiteUrl: "s3-website-bucket-bf7e357.s3-website-us-west-2.amazonaws.com"

Resources:
    - 4 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
Stack successfully destroyed
```

# Multi-Stack Orchestration

This program demonstrates how use Automation API to orchestrate multiple stacks, including propagating stack outputs as inputs to dependent stacks. This example creates two micro-stacks using `inline` Pulumi programs to deploy a static S3 bucket website:

1. `inlineMultiStackWebsite`: this project deploys the website bucket.
2. `inlineMultiStackObject`: this project deploys an object (our index.hmtl) to the bucket. It reads the bucket ID from the stack outputs of `inlineMultiStackWebsite`.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
preparing website stack
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
website stack ready to deploy
Starting website stack update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineMultiStackWebsite/dev/updates/7


 +  pulumi:pulumi:Stack inlineMultiStackWebsite-dev creating
 +  aws:s3:Bucket s3-website-bucket creating
 +  aws:s3:Bucket s3-website-bucket created
 +  aws:s3:BucketPolicy bucketPolicy creating
 +  aws:s3:BucketPolicy bucketPolicy created
 +  pulumi:pulumi:Stack inlineMultiStackWebsite-dev created

Outputs:
    bucketID  : "s3-website-bucket-9bddf39"
    websiteUrl: "s3-website-bucket-9bddf39.s3-website-us-west-2.amazonaws.com"

Resources:
    + 3 created

Duration: 5s

Website stack update succeeded!
go bucketID for object stack
preparing object stack
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
object stack ready to deploy
Starting object stack update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineMultiStackObject/dev/updates/6


 +  pulumi:pulumi:Stack inlineMultiStackObject-dev creating
 +  aws:s3:BucketObject index creating
 +  aws:s3:BucketObject index created
 +  pulumi:pulumi:Stack inlineMultiStackObject-dev created

Resources:
    + 2 created

Duration: 2s

Object stack update succeeded!
URL: s3-website-bucket-9bddf39.s3-website-us-west-2.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
preparing website stack
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
website stack ready to deploy
getting bucketID for object stack
go bucketID for object stack
preparing object stack
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
object stack ready to deploy
Starting object stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineMultiStackObject/dev/updates/8


 -  aws:s3:BucketObject index deleting
 -  aws:s3:BucketObject index deleted
 -  pulumi:pulumi:Stack inlineMultiStackObject-dev deleting
 -  pulumi:pulumi:Stack inlineMultiStackObject-dev deleted

Resources:
    - 2 deleted

Duration: 2s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
Object stack successfully destroyed
Starting website stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineMultiStackWebsite/dev/updates/9


 -  aws:s3:BucketPolicy bucketPolicy deleting
 -  aws:s3:BucketPolicy bucketPolicy deleted
 -  aws:s3:Bucket s3-website-bucket deleting
 -  aws:s3:Bucket s3-website-bucket deleted
 -  pulumi:pulumi:Stack inlineMultiStackWebsite-dev deleting
 -  pulumi:pulumi:Stack inlineMultiStackWebsite-dev deleted

Outputs:
  - bucketID  : "s3-website-bucket-9bddf39"
  - websiteUrl: "s3-website-bucket-9bddf39.s3-website-us-west-2.amazonaws.com"

Resources:
    - 3 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
Website stack successfully destroyed
```

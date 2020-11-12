# Git Repo Program

This program demonstrates how to use Automation API with a Pulumi program from git remote. This example deploys the [aws-go-s3 project from the pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-go-s3-folder). The Automation API takes care of all of the work of cloning and setting up the repo.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.10.1](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
Created/Selected stack "dev", and cloned program from git
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/aws-go-s3-folder/dev/updates/18


 +  pulumi:pulumi:Stack aws-go-s3-folder-dev creating
 +  aws:s3:Bucket s3-website-bucket creating
 +  aws:s3:Bucket s3-website-bucket created
 +  aws:s3:BucketPolicy bucketPolicy creating
 +  aws:s3:BucketObject index.html creating
 +  aws:s3:BucketObject favicon.png creating
 +  aws:s3:BucketPolicy bucketPolicy created
 +  aws:s3:BucketObject index.html created
 +  aws:s3:BucketObject favicon.png created
 +  pulumi:pulumi:Stack aws-go-s3-folder-dev created

Outputs:
    bucketName: "s3-website-bucket-85aa86a"
    websiteUrl: "s3-website-bucket-85aa86a.s3-website-us-west-2.amazonaws.com"

Resources:
    + 5 created

Duration: 8s

Update succeeded!
URL: s3-website-bucket-85aa86a.s3-website-us-west-2.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Created/Selected stack "dev", and cloned program from git
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/aws-go-s3-folder/dev/updates/20


 -  aws:s3:BucketPolicy bucketPolicy deleting
 -  aws:s3:BucketObject favicon.png deleting
 -  aws:s3:BucketObject index.html deleting
 -  aws:s3:BucketObject favicon.png deleted
 -  aws:s3:BucketObject index.html deleted
 -  aws:s3:BucketPolicy bucketPolicy deleted
 -  aws:s3:Bucket s3-website-bucket deleting
 -  aws:s3:Bucket s3-website-bucket deleted
 -  pulumi:pulumi:Stack aws-go-s3-folder-dev deleting
 -  pulumi:pulumi:Stack aws-go-s3-folder-dev deleted

Outputs:
  - bucketName: "s3-website-bucket-85aa86a"
  - websiteUrl: "s3-website-bucket-85aa86a.s3-website-us-west-2.amazonaws.com"

Resources:
    - 5 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
Stack successfully destroyed
```

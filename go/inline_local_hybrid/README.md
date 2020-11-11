# Inline/Local Hybrid Program

This program demonstrates how to setup a project to get the best of both worlds between `inline` and CLI driven programs. This project sets up a single automation program using an "inline" Pulumi program, that also has a "local" CLI driver. This allows us to have our fully debuggable automation driver with our Pulumi deployment as just another function, but maintain the ability to use the CLI for poking at outputs, manually doing previews, updates, destroys, etc. To accomplish this we have three separate modules:

1. `/infra`: This contains our inline program (`pulumi.RunFunc`). This is where all of our cloud resources are defined. In this case, we're creating an S3 website just like in the `inline_program` and `git_repo_program` examples.
2. `/automation`: This contains a `main.go` that uses the automation API. You can run or debug this like any other Go program `go run main.go`. This takes care all of the deployment orchestration. This program imports it's inline Pulumi program from `/infra`
3. `/cli`: This `main.go` that imports the Pulumi func from `/infra` and a `Pulumi.yaml` file. This is just a thin wrapper that allows using the CLI for things like inspecting outputs `pulumi stack output` or driving a deployment manually.


To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.10.1](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

First we'll run our automation program:

```shell
$ cd ./automation
$ go run main.go
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/hybridS3Project/dev/updates/22


 +  pulumi:pulumi:Stack hybridS3Project-dev creating
 +  aws:s3:Bucket s3-website-bucket creating
 +  aws:s3:Bucket s3-website-bucket created
 +  aws:s3:BucketObject index creating
 +  aws:s3:BucketPolicy bucketPolicy creating
 +  aws:s3:BucketObject index created
 +  aws:s3:BucketPolicy bucketPolicy created
 +  pulumi:pulumi:Stack hybridS3Project-dev created

Outputs:
    websiteUrl: "s3-website-bucket-8878c34.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 5s

Update succeeded!
URL: s3-website-bucket-8878c34.s3-website-us-west-2.amazonaws.com
```

Next we'll move to the CLI wrapper, and use the CLI to inspect the outputs:

```shell
$ cd ../cli
$ pulumi stack output
Current stack outputs (1):
    OUTPUT      VALUE
    websiteUrl  s3-website-bucket-xxxxxx.s3-website-us-west-2.amazonaws.com
```

We can get more details about the stack with `pulumi stack`:
```shell
$ pulumi stack
Current stack is dev:
    Owner: EvanBoyle
    Last updated: 1 minute ago (2020-09-01 19:59:54.837555 -0700 PDT)
    Pulumi version: v2.10.1
Current stack resources (5):
    TYPE                                     NAME
    pulumi:pulumi:Stack                      hybridS3Project-EvanBoyle/hybridS3Project/dev
    ├─ aws:s3/bucket:Bucket                  s3-website-bucket
    ├─ aws:s3/bucketPolicy:BucketPolicy      bucketPolicy
    ├─ aws:s3/bucketObject:BucketObject      index
    └─ pulumi:providers:aws                  default

Current stack outputs (1):
    OUTPUT      VALUE
    websiteUrl  s3-website-bucket-2fb5e5b.s3-website-us-west-2.amazonaws.com

More information at: https://app.pulumi.com/EvanBoyle/hybridS3Project/dev
```

Finally we'll go back to our automation program to destroy the stack via `go run main.go destroy`:

```shell
$ cd ../automation
$ go run main.go destroy
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/hybridS3Project/dev/updates/24


 -  aws:s3:BucketPolicy bucketPolicy deleting
 -  aws:s3:BucketObject index deleting
 -  aws:s3:BucketObject index deleted
 -  aws:s3:BucketPolicy bucketPolicy deleted
 -  aws:s3:Bucket s3-website-bucket deleting
 -  aws:s3:Bucket s3-website-bucket deleted
 -  pulumi:pulumi:Stack hybridS3Project-dev deleting
 -  pulumi:pulumi:Stack hybridS3Project-dev deleted

Outputs:
  - websiteUrl: "s3-website-bucket-8878c34.s3-website-us-west-2.amazonaws.com"

Resources:
    - 4 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
Stack successfully destroyed
```

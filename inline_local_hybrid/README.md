# Inline/Local Hybrid Program

This program demonstrates how to setup a project to get the best of both worlds between `inline` and CLI driven programs. This project sets up a single automation program using an "inline" pulumi program, that also has a "local" CLI driver. This allows us to have our fully debuggable automation driver with our pulumi deployment as just another function, but maintain the ability to use the CLI for poking at outputs, manually doing previews, updates, destroys, etc. To accomplish this we have three seperate modules:

1. `/infra`: This contains our inline program (`pulumi.RunFunc`). This is where all of our cloud resources are definied. In this case, we're creating an S3 website just like in the `inline_program` and `git_repo_program` examples.
2. `/automation`: This contains a `main.go` that uses the automation API. You can run or debug this like any other Go program `go run main.go`. This takes care all of the deployment orchestration. This program imports it's inline Pulumi program from `/infra`
3. `/cli`: This `main.go` that imports the pulumi func from `/infra` and a `Pulumi.yaml` file. This is just a thin wrapper that allows using the CLI for things like inspecting outputs `pulumi stack output` or driving a deployment manually.


To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.9.2](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

First we'll run our automation program:

```shell
$ cd ./automation
$ go run main.go
Successfully setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/hybridS3Project/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Update succeeded!
URL: s3-website-bucket-xxxxxxx.s3-website-us-west-2.amazonaws.com
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
    Pulumi version: v2.9.2
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
Successfully setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/hybridS3Project/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Stack successfully destroyed
```
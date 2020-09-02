# Multi-Stack Orchestration

This program demonstrates how use Automation API to orchestrate mutliple stacks, including propagating stack outputs as inputs to dependent stacks. This example creates two micro-stacks using `inline` pulumi programs to deploy a static S3 bucket website:

1. `inlineMultiStackWebsite`: this project deploys the website bucket.
2. `inlineMultiStackObject`: this project deploys an object (our index.hmtl) to the bucket. It reads the bucket ID from the stack outputs of `inlineMultiStackWebsite`.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.9.2](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
preparing website stack
Successfully setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/inlineMultiStackWebsite/dev"
Successfully set config
Starting refresh
Refresh succeeded!
website stack ready to deploy
Starting website stack update
Website stack update succeeded!
go bucketID for object stack
preparing object stack
Successfully setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/inlineMultiStackObject/dev"
Successfully set config
Starting refresh
Refresh succeeded!
object stack ready to deploy
Starting object stack update
Object stack update succeeded!
URL: s3-website-bucket-0a4ed53.s3-website-us-west-2.amazonaws.com

```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
preparing website stack
Successfully setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/inlineMultiStackWebsite/dev"
Successfully set config
Starting refresh
Refresh succeeded!
website stack ready to deploy
getting bucketID for object stack
go bucketID for object stack
preparing object stack
Successfully setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/inlineMultiStackObject/dev"
Successfully set config
Starting refresh
Refresh succeeded!
object stack ready to deploy
Starting object stack destroy
Object stack successfully destroyed
Starting website stack destroy
Website stack successfully destroyed

```
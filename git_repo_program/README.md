# Git Repo Program

This program demonstrates how use automation API with a Pulumi program from git remote. This example deploys the [aws-go-s3 project from the pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-go-s3-folder). The Automation API takes care of all of the work of cloning and setting up the repo.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.9.2](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
Successfully cloned project and setup workspace
Created/Select stack "EvanBoyle/aws-go-s3-folder/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Update succeeded!
URL: s3-website-bucket-xxxxxxx.s3-website-us-west-2.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Successfully cloned project and setup workspace
Created/Select stack "EvanBoyle/aws-go-s3-folder/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Stack successfully destroyed
```
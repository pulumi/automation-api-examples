# Inline Program

This program demonstrates how use automation API with an `inline` Pulumi program. Unline traditional Pulumi programs, inline functions don't require a seperate package on disk, with a `main.go` and `Pulumi.yaml`. Inline programs are just functions, can can be authored in the same `main.go` or be imported from anther package. This example deploys an AWS S3 website, with all the context and deployment automation defined in a single file.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.9.2](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
Successfully cloned project and setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/inlineS3Project/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Update succeeded!
URL: s3-website-bucket-xxxxxxxx.s3-website-us-west-2.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Successfully cloned project and setup workspace
Installing the AWS plugin
Successfully installed AWS plugin
Created/Select stack "EvanBoyle/inlineS3Project/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Stack successfully destroyed
```
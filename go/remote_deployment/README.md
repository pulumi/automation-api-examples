# Remote Deployment

This program demonstrates how to use Automation API to run Pulumi programs remotely with Pulumi Deployments on Pulumi service hardware (api.pulumi.com). This example deploys the [aws-ts-s3-folder project from the Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder).

To run this example you'll need a few pre-reqs:

1. A Pulumi CLI installation ([v3.45.0](https://www.pulumi.com/docs/get-started/install/versions/) or later), logged in to the Pulumi service via `pulumi login`.
2. AWS environment variables for AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`). [Learn more](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html?icmpid=docs_sso_user_portal).

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go <pulumi-username-or-organization>
```

This will kick-off the remote deployment using Pulumi Deployments.

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go <pulumi-username-or-organization> destroy
```

# Local Program

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation driver in `./automation` that contains a `main.go` file that can be invoked to preform the full deployment lifecycle including automatically selecting creating/selecting stacks, setting config, update, refresh, etc. Our Pulumi program deploys an ECS cluster, an ECR registry, builds and pushes a Docker image to the registry, and runs that image in a Fargate task exposed behind a load balancer. Our project layout looks like the following:

- `/app`: this is our dockerized web server. Our pulumi program will build and run this in a Fargate task.
- `/fargate`: our Pulumi CLI program. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program. See [this guide](https://github.com/pulumi/examples/tree/master/aws-go-fargate) for CLI-driven deployment details.
- `/automation`: a `main.go` containing our Automation API deployment driver. This can be run like any normal go program: `go run main.go`

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.9.2](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

To run our automation program we just `cd` to the directory and `go run main.go`:

```shell
$ go run main.go
Successfully setup workspace
Created/Select stack "EvanBoyle/fargate/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Update succeeded!
URL: web-lb-804c6d4-1601331384.us-west-2.elb.amazonaws.com

$ curl web-lb-804c6d4-1601331384.us-west-2.elb.amazonaws.com
47
$ curl web-lb-804c6d4-1601331384.us-west-2.elb.amazonaws.com
14
```
(note that the URL may take a minute or two to become reachable)

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Successfully setup workspace
Created/Select stack "EvanBoyle/fargate/dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Stack successfully destroyed
```
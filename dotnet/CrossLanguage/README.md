# Cross-Language Programs

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program written in a __different__ language. Here the Automation API script is written in `csharp` while the AWS Fargate Pulumi program is written in `go`. This project sets up an automation program in `./automation` that contains a .NET console application that can be invoked to perform the full deployment lifecycle including automatically creating and selecting stacks, setting config, update, refresh, etc. The Pulumi program deploys an ECS cluster, an ECR registry, builds and pushes a Docker image to the registry, and runs that image in a Fargate task exposed behind a load balancer. Our project layout looks like the following:

- `/app`: this is our dockerized (`go`) web server. Our Pulumi program will build and run this in a Fargate task.
- `/fargate`: our Pulumi CLI program written in `go`. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program. See [this guide](https://github.com/pulumi/examples/tree/master/aws-go-fargate) for CLI-driven deployment details.
- `/automation`: a .NET console application containing our Automation API deployment driver. This can be run like any normal .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.20.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 3.1.

To run our automation program we `cd` to the `automation` directory...
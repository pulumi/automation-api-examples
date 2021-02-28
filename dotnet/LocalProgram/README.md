# Local Program

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation driver in `./automation` that contains a .NET console application that can be invoked to perform the full deployment lifecycle including automatically selecting creating/selecting stacks, setting config, update, refresh, etc. Our project layout looks like the following:

- `/automation`: a .NET console application containing our Automation API deployment driver. This can be run like any normal .NET application using: `dotnet run`
- `/website`: a Pulumi program using the dotnet runtime, which deploys a simple static website.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.20.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 3.1.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

```shell
$ venv/LocalProgram/automation dotnet run
successfully initialized stack
setting up config...
config set
refreshing stack...
refresh complete
updating stack...
update summary:
    Create: 4
website url: s3-website-bucket-08d6756.s3-website-us-west-2.amazonaws.com
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ venv/LocalProgram/automation dotnet run destroy
successfully initialized stack
setting up config...
config set
refreshing stack...
refresh complete
destroying stack...
stack destroy complete
```

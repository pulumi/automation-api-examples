# Inline/Local Hybrid Program

This program demonstrates how to setup a project to get the best of both worlds between `inline` and CLI driven programs. This project sets up a single automation program using an "inline" Pulumi program, that also has a "local" CLI driver. This allows us to have our fully debuggable automation driver with our Pulumi deployment as just another function, but maintain the ability to use the CLI for poking at outputs, manually doing previews, updates, destroys, etc. To accomplish this we have three separate modules:

1. `/InlineLocalHybrid.Infra`: This contains our inline program (`PulumiFn.Create<T>()`). This is where all of our cloud resources are defined. In this case, we're creating an S3 website just like in the `InlineProgram` example.
2. `/InlineLocalHybrid.Automation`: This contains a `Program.cs` that uses the automation API. You can run or debug this like any other dotnet program `dotnet run`. This takes care all of the deployment orchestration. This program imports it's inline Pulumi stack from `/InlineLocalHybrid.Infra`
3. `/InlineLocalHybrid.CLI`: This `Program.cs` imports the Pulumi stack from `/InlineLocalHybrid.Infra` and a `Pulumi.yaml` file. This is just a thin wrapper that allows using the CLI for things like inspecting outputs `pulumi stack output` or driving a deployment manually.


To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

First we'll run our automation program:

```shell
$ cd ./InlineLocalHybrid.Automation
$ dotnet run
```

Next we'll move to the CLI wrapper, and use the CLI to inspect the outputs:

```shell
$ cd ../InlineLocalHybrid.CLI
$ pulumi stack output
```

We can get more details about the stack with `pulumi stack`:
```shell
$ pulumi stack
```

Finally we'll go back to our automation program to destroy the stack via `dotnet run destroy`:

```shell
$ cd ../InlineLocalHybrid.Automation
$ dotnet run destroy
```

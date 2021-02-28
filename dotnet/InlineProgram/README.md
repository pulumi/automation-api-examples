# Inline Program

This program demonstrates how to use Automation API with an `inline` Pulumi program. Unlike traditional Pulumi programs, inline functions don't require a separate package on disk, with a dotnet Pulumi project and `Pulumi.yaml`. Inline programs are just functions, can be authored in the same dotnet assembly or be imported from another assembly. This example deploys an AWS S3 website, with all the context and deployment automation defined in a single file.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.20.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 3.1.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

```shell
$ venv/InlineProgram dotnet run
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
refresh complete
updating stack...
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://0.0.0.0:62612
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\git\pulumi-auto-examples\dotnet\inlineprogram
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:62612/pulumirpc.LanguageRuntime/GetRequiredPlugins application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 70.4036ms 200 application/grpc
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:62612/pulumirpc.LanguageRuntime/Run application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 4216.0256ms 200 application/grpc
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
update summary:
    Same: 3
    Create: 1
website url: s3-website-bucket-41d0069.s3-website-us-west-2.amazonaws.com
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ venv/InlineProgram dotnet run destroy
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
refresh complete
destroying stack...
stack destroy complete
```

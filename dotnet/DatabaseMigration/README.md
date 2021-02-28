# Database Migration

This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.20.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 3.1.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

```shell
$ venv/DatabaseMigration dotnet run
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
refresh complete
updating stack...
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://0.0.0.0:63772
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\git\pulumi-auto-examples\dotnet\DatabaseMigration
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:63772/pulumirpc.LanguageRuntime/GetRequiredPlugins application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 68.5545ms 200 application/grpc
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:63772/pulumirpc.LanguageRuntime/Run application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 265125.8022ms 200 application/grpc
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
update summary:
    Create: 5
db host url: tf-20210228215611774600000001.cluster-cybcaqnrwvmo.us-west-2.rds.amazonaws.com
configuring db...
db configured!
rows inserted!
querying to verify data...
Result: 3 rows
database, table, and rows successfully configured
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ venv/DatabaseMigration dotnet run destroy
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

# Inline Program

This program demonstrates how to use Automation API with an `inline` Pulumi program. Unlike traditional Pulumi programs, inline functions don't require a separate package on disk, with a dotnet Pulumi project and `Pulumi.yaml`. Inline programs are just functions, can be authored in the same dotnet assembly or be imported from another assembly. This example deploys an AWS S3 website, with all the context and deployment automation defined in a single file.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 3.1.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

```shell
C:\code\pulumi-automation-examples\InlineProgram> dotnet run
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/inline_s3_project/dev/updates/13



Resources:

Duration: 0s

refresh complete
updating stack...
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://0.0.0.0:56333
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\git\pulumi-automation-examples\dotnet\InlineProgram
Updating (dev)

View Live: https://app.pulumi.com/joshstudt/inline_s3_project/dev/updates/14

info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:56333/pulumirpc.LanguageRuntime/GetRequiredPlugins application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/GetRequiredPlugins'

info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 75.0978ms 200 application/grpc
info: Microsoft.AspNetCore.Hosting.Diagnostics[1]
      Request starting HTTP/2 POST http://127.0.0.1:56333/pulumirpc.LanguageRuntime/Run application/grpc
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[0]
      Executing endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
 +  pulumi:pulumi:Stack inline_s3_project-dev creating
 +  aws:s3:Bucket s3-website-bucket creating
 +  aws:s3:Bucket s3-website-bucket created
 +  aws:s3:BucketPolicy bucket-policy creating
 +  aws:s3:BucketObject index creating
 +  aws:s3:BucketPolicy bucket-policy created
 +  aws:s3:BucketObject index created
info: Microsoft.AspNetCore.Routing.EndpointMiddleware[1]
      Executed endpoint 'gRPC - /pulumirpc.LanguageRuntime/Run'
info: Microsoft.AspNetCore.Hosting.Diagnostics[2]
      Request finished in 14559.5266ms 200 application/grpc
 +  pulumi:pulumi:Stack inline_s3_project-dev created

Outputs:
    website_url: "s3-website-bucket-4b4d633.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 15s

info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
update summary:
    Create: 4
website url: s3-website-bucket-4b4d633.s3-website-us-west-2.amazonaws.com
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
C:\code\pulumi-automation-examples\InlineProgram> dotnet run destroy
successfully initialized stack
installing plugins...
plugins installed
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/inline_s3_project/dev/updates/15


 ~  pulumi:pulumi:Stack inline_s3_project-dev refreshing
    pulumi:pulumi:Stack inline_s3_project-dev running
 ~  aws:s3:BucketPolicy bucket-policy refreshing
 ~  aws:s3:BucketObject index refreshing
 ~  aws:s3:Bucket s3-website-bucket refreshing
 ~  aws:s3:BucketPolicy bucket-policy updated [diff: ~policy]
    aws:s3:BucketObject index  [diff: +bucketKeyEnabled,cacheControl,contentDisposition,contentEncoding,contentLanguage,etag,metadata,objectLockLegalHoldStatus,objectLockMode,objectLockRetainUntilDate,serverSideEncryption,storageClass,tags,websiteRedirect]
    aws:s3:Bucket s3-website-bucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning,websiteDomain,websiteEndpoint~website]
    pulumi:pulumi:Stack inline_s3_project-dev

Outputs:
    website_url: "s3-website-bucket-4b4d633.s3-website-us-west-2.amazonaws.com"

Resources:
    ~ 1 updated
    3 unchanged

Duration: 8s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/joshstudt/inline_s3_project/dev/updates/16


 -  aws:s3:BucketPolicy bucket-policy deleting
 -  aws:s3:BucketObject index deleting
 -  aws:s3:BucketObject index deleted
 -  aws:s3:BucketPolicy bucket-policy deleted
 -  aws:s3:Bucket s3-website-bucket deleting
 -  aws:s3:Bucket s3-website-bucket deleted
 -  pulumi:pulumi:Stack inline_s3_project-dev deleting
 -  pulumi:pulumi:Stack inline_s3_project-dev deleted

Outputs:
  - website_url: "s3-website-bucket-4b4d633.s3-website-us-west-2.amazonaws.com"

Resources:
    - 4 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```

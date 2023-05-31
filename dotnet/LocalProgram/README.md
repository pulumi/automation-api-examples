# Local Program

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation driver in `./automation` that contains a .NET console application that can be invoked to perform the full deployment lifecycle including automatically selecting creating/selecting stacks, setting config, update, refresh, etc. Our project layout looks like the following:

- `/automation`: a .NET console application containing our Automation API deployment driver. This can be run like any normal .NET application using: `dotnet run`
- `/website`: a Pulumi program using the dotnet runtime, which deploys a simple static website.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 6.0.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

```shell
C:\code\pulumi-automation-examples\LocalProgram\automation> dotnet run
successfully initialized stack
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/website/dev/updates/18



Resources:

Duration: 0s

refresh complete
updating stack...
Updating (dev)

View Live: https://app.pulumi.com/joshstudt/website/dev/updates/19

    pulumi:pulumi:Stack website-dev  running 'dotnet build -nologo .'
    pulumi:pulumi:Stack website-dev    Determining projects to restore...
    pulumi:pulumi:Stack website-dev    Restored C:\git\pulumi-automation-examples\dotnet\LocalProgram\website\Website.csproj (in 500 ms).
    pulumi:pulumi:Stack website-dev    Website -> C:\git\pulumi-automation-examples\dotnet\LocalProgram\website\bin\Debug\net6.0\Website.dll
    pulumi:pulumi:Stack website-dev
    pulumi:pulumi:Stack website-dev  Build succeeded.
    pulumi:pulumi:Stack website-dev  'dotnet build -nologo .' completed successfully

 +  pulumi:pulumi:Stack website-dev creating 'dotnet build -nologo .' completed successfully
 +  aws:s3:Bucket s3-website-bucket creating
 +  aws:s3:Bucket s3-website-bucket created
 +  aws:s3:BucketObject index creating
 +  aws:s3:BucketPolicy bucket-policy creating
 +  aws:s3:BucketPolicy bucket-policy created
 +  aws:s3:BucketObject index created
 +  pulumi:pulumi:Stack website-dev created

Outputs:
    WebsiteUrl: "s3-website-bucket-122e0d2.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 16s

update summary:
    Create: 4
website url: s3-website-bucket-122e0d2.s3-website-us-west-2.amazonaws.com
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
C:\code\pulumi-automation-examples\LocalProgram\automation> dotnet run destroy
successfully initialized stack
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/website/dev/updates/20


 ~  pulumi:pulumi:Stack website-dev refreshing
    pulumi:pulumi:Stack website-dev running
 ~  aws:s3:BucketPolicy bucket-policy refreshing
 ~  aws:s3:Bucket s3-website-bucket refreshing
 ~  aws:s3:BucketObject index refreshing
 ~  aws:s3:BucketPolicy bucket-policy updated [diff: ~policy]
    aws:s3:BucketObject index  [diff: +bucketKeyEnabled,cacheControl,contentDisposition,contentEncoding,contentLanguage,etag,metadata,objectLockLegalHoldStatus,objectLockMode,objectLockRetainUntilDate,serverSideEncryption,storageClass,tags,websiteRedirect]
    aws:s3:Bucket s3-website-bucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning,websiteDomain,websiteEndpoint~website]
    pulumi:pulumi:Stack website-dev

Outputs:
    WebsiteUrl: "s3-website-bucket-122e0d2.s3-website-us-west-2.amazonaws.com"

Resources:
    ~ 1 updated
    3 unchanged

Duration: 7s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/joshstudt/website/dev/updates/21


 -  aws:s3:BucketPolicy bucket-policy deleting
 -  aws:s3:BucketObject index deleting
 -  aws:s3:BucketObject index deleted
 -  aws:s3:BucketPolicy bucket-policy deleted
 -  aws:s3:Bucket s3-website-bucket deleting
 -  aws:s3:Bucket s3-website-bucket deleted
 -  pulumi:pulumi:Stack website-dev deleting
 -  pulumi:pulumi:Stack website-dev deleted

Outputs:
  - WebsiteUrl: "s3-website-bucket-122e0d2.s3-website-us-west-2.amazonaws.com"

Resources:
    - 4 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```

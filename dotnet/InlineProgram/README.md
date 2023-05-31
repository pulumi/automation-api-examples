# Inline Program

This program demonstrates how to use Automation API with an `inline` Pulumi program. Unlike traditional Pulumi programs, inline functions don't require a separate package on disk, with a dotnet Pulumi project and `Pulumi.yaml`. Inline programs are just functions, can be authored in the same dotnet assembly or be imported from another assembly. This example deploys an AWS S3 website, with all the context and deployment automation defined in a single file.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 6.0.

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

View Live: https://app.pulumi.com/pierskarsenbarg/inline_s3_project/dev/updates/1



Resources:

Duration: 1s

refresh complete
updating stack...
Updating (dev)

View Live: https://app.pulumi.com/pierskarsenbarg/inline_s3_project/dev/updates/2


 +  pulumi:pulumi:Stack inline_s3_project-dev creating (0s) 
@ Updating.........
 +  aws:s3:Bucket s3-website-bucket creating (0s) 
@ Updating.........
 +  aws:s3:Bucket s3-website-bucket created (5s) 
 +  aws:s3:BucketOwnershipControls ownership creating (0s) 
 +  aws:s3:BucketPublicAccessBlock accessBlock creating (0s) 
 +  aws:s3:BucketObject index creating (0s) 
@ Updating.....
 +  aws:s3:BucketPolicy bucket-policy creating (0s) 
 +  aws:s3:BucketOwnershipControls ownership created (1s) 
 +  aws:s3:BucketPublicAccessBlock accessBlock created (1s) 
 +  aws:s3:BucketObject index created (1s) 
 +  aws:s3:BucketPolicy bucket-policy created (0.78s) 
@ Updating....
 +  pulumi:pulumi:Stack inline_s3_project-dev created (12s) 

Outputs:
    website_url: "s3-website-bucket-f280e43.s3-website-us-west-2.amazonaws.com"

Resources:
    + 6 created

Duration: 16s

update summary:
    Create: 6
website url: s3-website-bucket-f280e43.s3-website-us-west-2.amazonaws.com
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

View Live: https://app.pulumi.com/pierskarsenbarg/inline_s3_project/dev/updates/3


 ~  pulumi:pulumi:Stack inline_s3_project-dev refreshing (0s) 
 ~  aws:s3:BucketOwnershipControls ownership refreshing (0s) 
 ~  aws:s3:BucketPublicAccessBlock accessBlock refreshing (0s) 
 ~  aws:s3:BucketObject index refreshing (0s) 
 ~  aws:s3:BucketPolicy bucket-policy refreshing (0s) 
 ~  aws:s3:Bucket s3-website-bucket refreshing (0s) 
    pulumi:pulumi:Stack inline_s3_project-dev running 
@ Refreshing......
    aws:s3:BucketPolicy bucket-policy  
    aws:s3:BucketPublicAccessBlock accessBlock  
@ Refreshing....
    aws:s3:BucketOwnershipControls ownership  
    aws:s3:BucketObject index  
@ Refreshing......
    aws:s3:Bucket s3-website-bucket  
    pulumi:pulumi:Stack inline_s3_project-dev  

Outputs:
    website_url: "s3-website-bucket-f280e43.s3-website-us-west-2.amazonaws.com"

Resources:
    6 unchanged

Duration: 7s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/pierskarsenbarg/inline_s3_project/dev/updates/4


 -  aws:s3:BucketOwnershipControls ownership deleting (0s) 
 -  aws:s3:BucketObject index deleting (0s) 
 -  aws:s3:BucketPolicy bucket-policy deleting (0s) 
 -  aws:s3:BucketPublicAccessBlock accessBlock deleting (0s) 
@ Destroying......
 -  aws:s3:BucketObject index deleted (2s) 
 -  aws:s3:BucketPolicy bucket-policy deleted (2s) 
 -  aws:s3:BucketPublicAccessBlock accessBlock deleted (3s) 
@ Destroying....
 -  aws:s3:BucketOwnershipControls ownership deleted (3s) 
 -  aws:s3:Bucket s3-website-bucket deleting (0s) 
 -  aws:s3:Bucket s3-website-bucket deleted (0.62s) 
@ Destroying....
 -  pulumi:pulumi:Stack inline_s3_project-dev deleting (0s) 
@ Destroying....
 -  pulumi:pulumi:Stack inline_s3_project-dev deleted 

Outputs:
  - website_url: "s3-website-bucket-f280e43.s3-website-us-west-2.amazonaws.com"

Resources:
    - 6 deleted

Duration: 7s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run `pulumi stack rm dev`.
stack destroy complete
```

# Cross-Language Programs

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation program in `./automation` that contains an `index.ts` file that can be invoked to perform the full deployment lifecycle including automatically creating and selecting stacks, setting config, update, refresh, etc. Our Pulumi program deploys a static S3 website. Our project layout looks like the following:

- `/website`: our Pulumi CLI program written in `typescript`. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program (`pulumi up`).
- `/automation`: an `index.ts` containing our Automation API deployment driver. This can be run like any normal `typescript` program: `yarn run start` will invoke our program with `ts-node`.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

To run our automation program we `cd` to the `automation` directory (after installing deps) and `yarn run start`:

```shell
$ cd website
$ yarn install
$ cd ../automation
$ yarn start
yarn run v1.19.1
$ ./node_modules/ts-node/dist/bin.js index.ts
successfully initialized stack
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/website/dev/updates/1





refresh complete
updating stack...
Updating (dev)


View Live: https://app.pulumi.com/EvanBoyle/website/dev/updates/2




 +  pulumi:pulumi:Stack website-dev creating

 +  aws:s3:Bucket my-bucket creating

 +  aws:s3:Bucket s3-website-bucket creating

 +  aws:s3:Bucket my-bucket created

 +  aws:s3:Bucket s3-website-bucket created

 +  aws:s3:BucketPolicy bucketPolicy creating

 +  aws:s3:BucketPolicy bucketPolicy created

 +  pulumi:pulumi:Stack website-dev created


Outputs:
    bucketName: "my-bucket-5c9e59e"
    websiteUrl: "s3-website-bucket-f028def.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 12s


update summary:
{
    "create": 4
}
website url: s3-website-bucket-f028def.s3-website-us-west-2.amazonaws.com
✨  Done in 17.34s.
```
(note that the URL may take a minute or two to become reachable)

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ yarn start destroy
yarn run v1.19.1
$ ./node_modules/ts-node/dist/bin.js index.ts destroy
successfully initialized stack
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/website/dev/updates/5




 ~  pulumi:pulumi:Stack website-dev refreshing

    pulumi:pulumi:Stack website-dev running

 ~  aws:s3:BucketPolicy bucketPolicy refreshing

 ~  aws:s3:Bucket my-bucket refreshing

 ~  aws:s3:Bucket s3-website-bucket refreshing

    aws:s3:BucketPolicy bucketPolicy  [diff: ~policy]

    aws:s3:Bucket my-bucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning]

    aws:s3:Bucket s3-website-bucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning,websiteDomain,websiteEndpoint~website]

    pulumi:pulumi:Stack website-dev


Outputs:
    bucketName: "my-bucket-5c9e59e"
    websiteUrl: "s3-website-bucket-f028def.s3-website-us-west-2.amazonaws.com"

Resources:
    4 unchanged

Duration: 3s


refresh complete
destroying stack...
Destroying (dev)


View Live: https://app.pulumi.com/EvanBoyle/website/dev/updates/6




 -  aws:s3:BucketPolicy bucketPolicy deleting

 -  aws:s3:BucketPolicy bucketPolicy deleted

 -  aws:s3:Bucket my-bucket deleting

 -  aws:s3:Bucket s3-website-bucket deleting

 -  aws:s3:Bucket my-bucket deleted

 -  aws:s3:Bucket s3-website-bucket deleted

 -  pulumi:pulumi:Stack website-dev deleting

 -  pulumi:pulumi:Stack website-dev deleted


Outputs:
  - bucketName: "my-bucket-5c9e59e"
  - websiteUrl: "s3-website-bucket-f028def.s3-website-us-west-2.amazonaws.com"

Resources:
    - 4 deleted

Duration: 3s


The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.

stack destroy complete
✨  Done in 8.68s.
```

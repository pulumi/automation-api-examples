# Inline Program

This program demonstrates how to use Automation API with an `inline` Pulumi program and custom secrets provider. This example builds on the basic example in `inlineProgram-ts`
but uses a local backend and custom secrets provider, which requires setting the configuration and re-using it on subsequent runs.

This example has a VSCode debug configuration that enables setting breakpoints within both the Automation API code, and things like `.apply` calls within the Pulumi program.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.25.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. An AWS KMS key, which you will replace for `const secretsProvider = "awskms://aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?region=us-west-2";` in `index.ts`
4. install deps: `yarn install`
5. Either have `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` set in your environment such that it can use the above key or set as additional `envVars`
to the local workspace options.

Running this program is just like any other typescript program. No invocation through the Pulumi CLI required:

```shell
$ mkdir ~/.pulumi-local
$ yarn install
$ yarn start
yarn run v1.19.1
$ ./node_modules/ts-node/dist/bin.js index.ts
successfully initialized stack
installing plugins...
plugins installed
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/inlineNode/dev/updates/23






refresh complete
updating stack...
Updating (dev)


View Live: https://app.pulumi.com/EvanBoyle/inlineNode/dev/updates/24




 +  pulumi:pulumi:Stack inlineNode-dev creating

 +  aws:s3:Bucket s3-website-bucket creating

 +  aws:s3:Bucket s3-website-bucket created

 +  aws:s3:BucketPolicy bucketPolicy creating

 +  aws:s3:BucketPolicy bucketPolicy created

 +  pulumi:pulumi:Stack inlineNode-dev created


Outputs:
    secretValue: "[secret]"
    websiteUrl : "s3-website-bucket-c18c31c.s3-website-us-west-2.amazonaws.com"

Resources:
    + 3 created

Duration: 6s


update summary:
{
    "create": 3
}
website url: s3-website-bucket-c18c31c.s3-website-us-west-2.amazonaws.com
✨  Done in 15.49s.
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ yarn run start destroy
yarn run v1.19.1
$ ./node_modules/ts-node/dist/bin.js index.ts destroy
successfully initialized stack
installing plugins...
plugins installed
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/inlineNode/dev/updates/25




 ~  pulumi:pulumi:Stack inlineNode-dev refreshing

    pulumi:pulumi:Stack inlineNode-dev running

 ~  aws:s3:BucketPolicy bucketPolicy refreshing

 ~  aws:s3:Bucket s3-website-bucket refreshing

 ~  aws:s3:BucketPolicy bucketPolicy updated [diff: ~policy]

    aws:s3:Bucket s3-website-bucket  [diff: +accelerationStatus,arn,corsRules,grants,hostedZoneId,lifecycleRules,loggings,requestPayer,tags,versioning,websiteDomain,websiteEndpoint~website]

    pulumi:pulumi:Stack inlineNode-dev


Outputs:
    secretValue: "[secret]"
    websiteUrl : "s3-website-bucket-c18c31c.s3-website-us-west-2.amazonaws.com"

Resources:
    ~ 1 updated
    2 unchanged

Duration: 3s


refresh complete
destroying stack...
Destroying (dev)


View Live: https://app.pulumi.com/EvanBoyle/inlineNode/dev/updates/26




 -  aws:s3:BucketPolicy bucketPolicy deleting

 -  aws:s3:BucketPolicy bucketPolicy deleted

 -  aws:s3:Bucket s3-website-bucket deleting

 -  aws:s3:Bucket s3-website-bucket deleted

 -  pulumi:pulumi:Stack inlineNode-dev deleting

 -  pulumi:pulumi:Stack inlineNode-dev deleted


Outputs:
  - secretValue: "[secret]"
  - websiteUrl : "s3-website-bucket-c18c31c.s3-website-us-west-2.amazonaws.com"

Resources:
    - 3 deleted

Duration: 3s


The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.

stack destroy complete
✨  Done in 13.73s.
```

## Debugging

This project includes VSCode debug configuration. Open VSCode from this directory and `F5` to start debugging, including `.apply` calls within the pulumi program itself. Give it a try!

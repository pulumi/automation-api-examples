# Pulumi Over HTTP - Static Websites as a RESTful API

This application demonstrates how to run Automation API in an HTTP server to expose infrastructure as RESTful resources. In our case, we've defined and exposed a static website `site` that exposes all of the `CRUD` operations plus list. Users can hit our REST endpoint and create custom static websites by specifying the `content` field in the `POST` body. All of our infrastructure is defined in `inline` programs that are constructed and altered on the fly based on input parsed from `POST` bodies. 

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.10.1](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

In one terminal window, run the HTTP server that uses Automation API. It will also stream update logs:

```bash
$ go run main.go
starting server on :1337

Updating (hello)

View Live: https://app.pulumi.com/EvanBoyle/pulumi_over_http/hello/updates/1


 +  pulumi:pulumi:Stack pulumi_over_http-hello creating 
 +  aws:s3:Bucket s3-website-bucket creating 
 +  aws:s3:Bucket s3-website-bucket created 
 +  aws:s3:BucketObject index creating 
 +  aws:s3:BucketPolicy bucketPolicy creating 
 +  aws:s3:BucketObject index created 
 +  aws:s3:BucketPolicy bucketPolicy created 
 +  pulumi:pulumi:Stack pulumi_over_http-hello created 
 
Outputs:
    websiteUrl: "s3-website-bucket-549d9d3.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 6s
```

Open another terminal window to execute some `curl` commands and create some sites:

```bash
# create "hello" site
$ curl --header "Content-Type: application/json"   --request POST   --data '{"id":"hello","content":"hello world\n"}'   http://localhost:1337/sites
{"id":"hello","url":"s3-website-bucket-549d9d3.s3-website-us-west-2.amazonaws.com"}
# curl our "hello" site
$  curl s3-website-bucket-549d9d3.s3-website-us-west-2.amazonaws.com
hello world
# update our "hello" site content
$ curl --header "Content-Type: application/json"   --request PUT   --data '{"id":"hello","content":"hello updated world!\n"}'   http://localhost:1337/sites/hello
{"id":"hello","url":"s3-website-bucket-549d9d3.s3-website-us-west-2.amazonaws.com"}
# curl our update hello site
$ curl s3-website-bucket-549d9d3.s3-website-us-west-2.amazonaws.com
hello updated world!
# add a "bye" site
$ curl --header "Content-Type: application/json"   --request POST   --data '{"id":"bye","content":"good bye world\n"}'   http://localhost:1337/sites
{"id":"bye","url":"s3-website-bucket-2eaf3da.s3-website-us-west-2.amazonaws.com"}
# curl our "bye" site
$ curl s3-website-bucket-2eaf3da.s3-website-us-west-2.amazonaws.com
good bye world
# list our sites
$ curl http://localhost:1337/sites
{"ids":["bye","hello"]}
# get the URL of a specific site
$ curl http://localhost:1337/sites/hello
{"id":"hello","url":"s3-website-bucket-549d9d3.s3-website-us-west-2.amazonaws.com"}
# delete our "bye" site
$ curl --header "Content-Type: application/json"   --request DELETE http://localhost:1337/sites/bye
# list sites again and see it's gone
$ curl http://localhost:1337/sites
{"ids":["hello"]}
```




# Inline Program

This program demonstrates how use automation API with an `inline` Pulumi program. Unline traditional Pulumi programs, inline functions don't require a seperate package on disk, with a `main.go` and `Pulumi.yaml`. Inline programs are just functions, can can be authored in the same `main.go` or be imported from anther package. This example deploys an AWS S3 website, with all the context and deployment automation defined in a single file.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.10.1](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineS3Project/dev/updates/22


 +  pulumi:pulumi:Stack inlineS3Project-dev creating 
 +  aws:s3:Bucket s3-website-bucket creating 
 +  aws:s3:Bucket s3-website-bucket created 
 +  aws:s3:BucketObject index creating 
 +  aws:s3:BucketPolicy bucketPolicy creating 
 +  aws:s3:BucketObject index created 
 +  aws:s3:BucketPolicy bucketPolicy created 
 +  pulumi:pulumi:Stack inlineS3Project-dev created 
 
Outputs:
    websiteUrl: "s3-website-bucket-bf7e357.s3-website-us-west-2.amazonaws.com"

Resources:
    + 4 created

Duration: 10s

Update succeeded!
URL: s3-website-bucket-bf7e357.s3-website-us-west-2.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Created/Selected stack "dev"
Installing the AWS plugin
Successfully installed AWS plugin
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/inlineS3Project/dev/updates/24


 -  aws:s3:BucketPolicy bucketPolicy deleting 
 -  aws:s3:BucketObject index deleting 
 -  aws:s3:BucketObject index deleted 
 -  aws:s3:BucketPolicy bucketPolicy deleted 
 -  aws:s3:Bucket s3-website-bucket deleting 
 -  aws:s3:Bucket s3-website-bucket deleted 
 -  pulumi:pulumi:Stack inlineS3Project-dev deleting 
 -  pulumi:pulumi:Stack inlineS3Project-dev deleted 
 
Outputs:
  - websiteUrl: "s3-website-bucket-bf7e357.s3-website-us-west-2.amazonaws.com"

Resources:
    - 4 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run 'pulumi stack rm dev'.
Stack successfully destroyed
```
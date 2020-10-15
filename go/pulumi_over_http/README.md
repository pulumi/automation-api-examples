# Pulumi Over HTTP - Static Websites as a RESTful API

This application demonstrates how to run Automation API in an HTTP server to expose infrastructure as RESTful resources. In our case, we've defined and exposed a static website `site` that exposes all of the `CRUD` operations plus list. Users can hit our REST endpoint and create custom static websites by specifying the `content` field in the `POST` body. All of our infrastructure is defined in `inline` programs that are constructed and altered on the fly based on input parsed from user specified `POST` bodies. 

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

# Pulumi Over HTTP - Static Websites as a RESTful API

This application demonstrates how to run Automation API in an HTTP server to expose infrastructure as RESTful resources. In our case, we've defined and exposed a static website `site` that exposes all of the `CRUD` operations plus list. Users can hit our REST endpoint and create custom static websites by specifying the `content` field in the `POST` body. All of our infrastructure is defined in `inline` programs that are constructed and altered on the fly based on input parsed from user-specified `POST` bodies. Be sure to read through the handlers to see how Automation API detect structured error cases such as update conflicts (409), and missing stacks (404).

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.

First, set up your virtual environment:
1. ```shell
   $ python3 -m venv venv
   ```
2. ```shell
   $ venv/bin/python3 -m pip install --upgrade pip
   ```
3. ```shell
   $ venv/bin/pip install -r requirements.txt
   ```
   
In one terminal window, run the HTTP server that uses Automation API. It will also stream update logs:

```bash
$ FLASK_RUN_PORT=1337 FLASK_ENV=development venv/bin/flask run
* Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:1337/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 328-006-235
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

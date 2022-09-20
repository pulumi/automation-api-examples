# Testing a local program

This example uses the Automation API alongside the `unittest` Python package to deploy an S3 bucket as a website with some website content, then run some tests against this and finally destroy the infrastructure. It uses `unittest`'s `setUp()` and `tearDown()` methods to do this.

## Running this example

First, set up your virtual environment and install the required packages:

1. `python3 -m venv venv`
1. `venv/bin/python3 -m pip install --upgrade pip`
1. `venv/bin/pip install -r requirements.txt`

Next, run the tests:

`venv/bin/python3 -m unittest`

You should see output like the following:

```zsh
preparing virtual environment...
virtual environment is ready!
successfully initialized stack
setting up config
config set
refreshing stack
Refreshing (dev)

View Live: https://app.pulumi.com/pierskarsenbarg/testing_infrastructure/dev/updates/2



Resources:

Duration: 1s

refresh complete
deploying infrastructure
Updating (dev)

View Live: https://app.pulumi.com/pierskarsenbarg/testing_infrastructure/dev/updates/3


 +  pulumi:pulumi:Stack testing_infrastructure-dev creating
 +  aws:s3:Bucket auto-api-bucket creating
 +  aws:s3:Bucket auto-api-bucket created
 +  aws:s3:BucketObject index_html creating
 +  aws:s3:BucketObject index_html created
 +  aws:s3:BucketPolicy bucket_policy creating
 +  aws:s3:BucketPolicy bucket_policy created
 +  pulumi:pulumi:Stack testing_infrastructure-dev created

Outputs:
    url: "http://auto-api-bucket-31b4e6d.s3-website-eu-west-1.amazonaws.com/index.html"

Resources:
    + 4 created

Duration: 13s

infrastructure deployed
destroying infrastructure
Destroying (dev)

View Live: https://app.pulumi.com/pierskarsenbarg/testing_infrastructure/dev/updates/4


 -  aws:s3:BucketPolicy bucket_policy deleting
 -  aws:s3:BucketObject index_html deleting
 -  aws:s3:BucketObject index_html deleted
 -  aws:s3:BucketPolicy bucket_policy deleted
 -  aws:s3:Bucket auto-api-bucket deleting
 -  aws:s3:Bucket auto-api-bucket deleted
 -  pulumi:pulumi:Stack testing_infrastructure-dev deleting
 -  pulumi:pulumi:Stack testing_infrastructure-dev deleted

Outputs:
  - url: "http://auto-api-bucket-31b4e6d.s3-website-eu-west-1.amazonaws.com/index.html"

Resources:
    - 4 deleted

Duration: 6s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run `pulumi stack rm dev`.
infrastructure destroyed
deleting stack
stack deleted
.
----------------------------------------------------------------------
Ran 1 test in 65.580s

OK
```
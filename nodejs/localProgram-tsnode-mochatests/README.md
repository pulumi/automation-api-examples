# Deploy a S3 website using Automation API

## Requirements

1. Pulumi CLI installed ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
1. AWS CLI with appropriate credentials set up

## To run tests

1. `npm install` 
1. `npm test`

## To run Pulumi code

1. `cd infrastructure`
1. `npm install`
1. `pulumi up`

## To destroy stack

The tests will destroy the infrastructure once all the tests are complete but you can run `cd infrastructure && pulumi destroy` as well

## Delete the stack

Automation API currently doesn't allow for stack deletion so you'll have to run `cd infrastructure && pulumi stack rm dev` 

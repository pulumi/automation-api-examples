#!/usr/bin/env bash

# Pulumi.yaml
echo "name: pulumi_over_http" > Pulumi.yaml
echo "runtime: nodejs" >> Pulumi.yaml

# Pulumi.hello.yaml
pulumi stack select roderik/pulumi_over_http/hello
pulumi config refresh

pulumi cancel --yes roderik/pulumi_over_http/hello

pulumi stack export | jq "del(.deployment.pending_operations)" | pulumi stack import

pulumi destroy --yes -s roderik/pulumi_over_http/hello

pulumi stack rm --yes roderik/pulumi_over_http/hello

# Local Program

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation driver in `./automation` that contains a `main.py` file that can be invoked to perform the full deployment lifecycle including automatically selecting creating/selecting stacks, setting config, update, refresh, etc. Our project layout looks like the following:

- `/aws-py-voting-app`: This is the app from the [aws-py-voting-app](https://github.com/pulumi/examples/tree/master/aws-py-voting-app) example, including the CLI-driven pulumi program.
- `/automation`: a `main.py` containing our Automation API deployment driver. This can be run like any normal python program: `python main.py`

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. Docker

First, cd into the `automation` directory and set up your virtual environment:
1. ```shell
   $ python3 -m venv venv
   ```
2. ```shell
   $ venv/bin/python3 -m pip install --upgrade pip
   ```
3. ```shell
   $ venv/bin/pip install -r requirements.txt
   ```

To run our automation program, run `venv/bin/python main.py`:

```shell
$ venv/bin/python main.py
preparing virtual environment...
virtual environment is ready!
successfully initialized stack
setting up config
config set
refreshing stack
Refreshing (dev)

View Live: https://app.pulumi.com/komalali/voting-app/dev/updates/1



Resources:

Duration: 1s

refresh complete
updating stack...
Updating (dev)

View Live: https://app.pulumi.com/komalali/voting-app/dev/updates/2


+  pulumi:pulumi:Stack voting-app-dev creating
+  docker:image:Image flask-dockerimage creating
+  aws:iam:Role app-task-role creating
+  aws:ecs:Cluster app-cluster creating
+  aws:ecr:Repository app-ecr-repo creating
+  aws:ec2:Vpc app-vpc creating
+  aws:iam:Role app-exec-role creating
+  aws:ecr:Repository app-ecr-repo created
+  aws:iam:Role app-task-role created
+  aws:ecr:LifecyclePolicy app-lifecycle-policy creating
+  aws:iam:RolePolicyAttachment app-access-policy creating
+  aws:iam:RolePolicyAttachment app-lambda-policy creating
+  aws:iam:Role app-exec-role created
+  aws:ecr:LifecyclePolicy app-lifecycle-policy created
+  aws:iam:RolePolicyAttachment app-exec-policy creating
+  aws:ecs:TaskDefinition redis-task-definition creating
+  aws:ecs:TaskDefinition redis-task-definition created
+  aws:iam:RolePolicyAttachment app-access-policy created
+  aws:iam:RolePolicyAttachment app-lambda-policy created
+  aws:iam:RolePolicyAttachment app-exec-policy created
+  aws:ec2:Vpc app-vpc created
+  aws:ecs:Cluster app-cluster created
+  docker:image:Image flask-dockerimage creating {"Client":{"Platform":{"Name":"Docker Engine - Community"},"CloudIntegration":"1.0.4","Version":"20.10.2","ApiVersion":"1.41","DefaultAPIVersion":"1.41","GitCommit":"2291f61","GoVersion":"go1.13.15","Os":"darwin","Arch":"amd64","BuildTime":"Mon Dec 28 16:12:42 2020","Context":"default","Experimental":true},"Server":{"Platform":{"Name":"Docker Engine - Community"},"Components":[{"Name":"Engine","Version":"20.10.2","Details":{"ApiVersion":"1.41","Arch":"amd64","BuildTime":"Mon Dec 28 16:15:23 2020","Experimental":"false","GitCommit":"8891c58","GoVersion":"go1.13.15","KernelVersion":"4.19.121-linuxkit","MinAPIVersion":"1.12","Os":"linux"}},{"Name":"containerd","Version":"v1.4.3","Details":{"GitCommit":"269548fa27e0089a8b8278fc4fc781d7f65a939b"}},{"Name":"runc","Version":"1.0.0-rc92","Details":{"GitCommit":"ff819c7e9184c13b7c2607fe6c30ae19403a7aff"}},{"Name":"docker-init","Version":"0.19.0","Details":{"GitCommit":"de40ad0"}}],"Version":"20.10.2","ApiVersion":"1.41","MinAPIVersion":"1.12","GitCommit":"8891c58","GoVersion":"go1.13.15","Os":"linux","Arch":"amd64","KernelVersion":"4.19.121-linuxkit","BuildTime":"2020-12-28T16:15:23.000000000+00:00"}}
+  docker:image:Image flask-dockerimage creating Login Succeeded
+  docker:image:Image flask-dockerimage creating Building image './frontend'...
+  docker:image:Image flask-dockerimage creating warning: #1 [internal] load build definition from Dockerfile
+  docker:image:Image flask-dockerimage creating sha256:8797dbded82bcf707f002103c4fd4e1e0cadc46585882e2aed5125e08da76e3c
+  docker:image:Image flask-dockerimage creating Image build succeeded.
+  docker:image:Image flask-dockerimage creating Pushing image '616138583583.dkr.ecr.us-west-2.amazonaws.com/app-ecr-repo-d04e506'...
+  docker:image:Image flask-dockerimage creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/app-ecr-repo-d04e506]
+  docker:image:Image flask-dockerimage creating 37bf9e16c9fc: Preparing
+  docker:image:Image flask-dockerimage creating 86d25a24551e: Preparing
+  docker:image:Image flask-dockerimage creating dc1889a6560c: Preparing
+  docker:image:Image flask-dockerimage creating b7715857621b: Preparing
+  docker:image:Image flask-dockerimage creating 7560054c4860: Preparing
+  docker:image:Image flask-dockerimage creating 83743ed05e49: Preparing
+  docker:image:Image flask-dockerimage creating a9ffebc5be68: Preparing
+  docker:image:Image flask-dockerimage creating 27d9a6169c9f: Preparing
+  docker:image:Image flask-dockerimage creating b9557a3d31d9: Preparing
+  docker:image:Image flask-dockerimage creating c8f52965417f: Preparing
+  docker:image:Image flask-dockerimage creating 9cde96ca61c2: Preparing
+  docker:image:Image flask-dockerimage creating f3fd11fd6d6c: Preparing
+  docker:image:Image flask-dockerimage creating e553743c668b: Preparing
+  docker:image:Image flask-dockerimage creating 88af765ea71f: Preparing
+  docker:image:Image flask-dockerimage creating b47c358499df: Preparing
+  docker:image:Image flask-dockerimage creating cbd550635f44: Preparing
+  docker:image:Image flask-dockerimage creating 2efef025159b: Preparing
+  docker:image:Image flask-dockerimage creating 3acbf6947195: Preparing
+  docker:image:Image flask-dockerimage creating f90fe4978ca2: Preparing
+  docker:image:Image flask-dockerimage creating 88383b8e3cb5: Preparing
+  docker:image:Image flask-dockerimage creating e93627dfc607: Preparing
+  docker:image:Image flask-dockerimage creating 8f23b00cc77f: Preparing
+  docker:image:Image flask-dockerimage creating cf691a2ea3f9: Preparing
+  docker:image:Image flask-dockerimage creating 3d3e92e98337: Preparing
+  docker:image:Image flask-dockerimage creating 8967306e673e: Preparing
+  docker:image:Image flask-dockerimage creating 9794a3b3ed45: Preparing
+  docker:image:Image flask-dockerimage creating 5f77a51ade6a: Preparing
+  docker:image:Image flask-dockerimage creating e40d297cf5f8: Preparing
+  docker:image:Image flask-dockerimage creating 83743ed05e49: Waiting
+  docker:image:Image flask-dockerimage creating cbd550635f44: Waiting
+  docker:image:Image flask-dockerimage creating 2efef025159b: Waiting
+  docker:image:Image flask-dockerimage creating a9ffebc5be68: Waiting
+  docker:image:Image flask-dockerimage creating 3acbf6947195: Waiting
+  docker:image:Image flask-dockerimage creating f90fe4978ca2: Waiting
+  docker:image:Image flask-dockerimage creating 88383b8e3cb5: Waiting
+  docker:image:Image flask-dockerimage creating 27d9a6169c9f: Waiting
+  docker:image:Image flask-dockerimage creating b9557a3d31d9: Waiting
+  docker:image:Image flask-dockerimage creating c8f52965417f: Waiting
+  docker:image:Image flask-dockerimage creating 9cde96ca61c2: Waiting
+  docker:image:Image flask-dockerimage creating f3fd11fd6d6c: Waiting
+  docker:image:Image flask-dockerimage creating e93627dfc607: Waiting
+  docker:image:Image flask-dockerimage creating 8f23b00cc77f: Waiting
+  docker:image:Image flask-dockerimage creating cf691a2ea3f9: Waiting
+  docker:image:Image flask-dockerimage creating 3d3e92e98337: Waiting
+  docker:image:Image flask-dockerimage creating 8967306e673e: Waiting
+  docker:image:Image flask-dockerimage creating e553743c668b: Waiting
+  docker:image:Image flask-dockerimage creating 88af765ea71f: Waiting
+  docker:image:Image flask-dockerimage creating 9794a3b3ed45: Waiting
+  docker:image:Image flask-dockerimage creating 5f77a51ade6a: Waiting
+  docker:image:Image flask-dockerimage creating b47c358499df: Waiting
+  docker:image:Image flask-dockerimage creating e40d297cf5f8: Waiting
+  docker:image:Image flask-dockerimage creating dc1889a6560c: Pushed
+  docker:image:Image flask-dockerimage creating b7715857621b: Pushed
+  docker:image:Image flask-dockerimage creating 37bf9e16c9fc: Pushed
+  docker:image:Image flask-dockerimage creating 7560054c4860: Pushed
+  docker:image:Image flask-dockerimage creating 27d9a6169c9f: Pushed
+  docker:image:Image flask-dockerimage creating 83743ed05e49: Pushed
+  docker:image:Image flask-dockerimage creating b9557a3d31d9: Pushed
+  docker:image:Image flask-dockerimage creating 9cde96ca61c2: Pushed
+  docker:image:Image flask-dockerimage creating c8f52965417f: Pushed
+  docker:image:Image flask-dockerimage creating 86d25a24551e: Pushed
+  docker:image:Image flask-dockerimage creating f3fd11fd6d6c: Pushed
+  docker:image:Image flask-dockerimage creating e553743c668b: Pushed
+  docker:image:Image flask-dockerimage creating b47c358499df: Pushed
+  docker:image:Image flask-dockerimage creating cbd550635f44: Pushed
+  docker:image:Image flask-dockerimage creating a9ffebc5be68: Pushed
+  docker:image:Image flask-dockerimage creating f90fe4978ca2: Pushed
+  docker:image:Image flask-dockerimage creating e93627dfc607: Pushed
+  docker:image:Image flask-dockerimage creating 88af765ea71f: Pushed
+  docker:image:Image flask-dockerimage creating 88383b8e3cb5: Pushed
+  docker:image:Image flask-dockerimage creating 2efef025159b: Pushed
+  docker:image:Image flask-dockerimage creating 3acbf6947195: Pushed
+  docker:image:Image flask-dockerimage creating cf691a2ea3f9: Pushed
+  docker:image:Image flask-dockerimage creating 9794a3b3ed45: Pushed
+  docker:image:Image flask-dockerimage creating 5f77a51ade6a: Pushed
+  docker:image:Image flask-dockerimage creating 8f23b00cc77f: Pushed
+  docker:image:Image flask-dockerimage creating e40d297cf5f8: Pushed
+  docker:image:Image flask-dockerimage creating 8967306e673e: Pushed
+  docker:image:Image flask-dockerimage creating 3d3e92e98337: Pushed
+  docker:image:Image flask-dockerimage creating 8797dbded82bcf707f002103c4fd4e1e0cadc46585882e2aed5125e08da76e3c: digest: sha256:50ed2042914931c82c162ae6c561ff2ef80dd3d7221d6529f4ba245136d1f289 size: 6175
+  docker:image:Image flask-dockerimage creating Using default tag: latest
+  docker:image:Image flask-dockerimage creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/app-ecr-repo-d04e506]
+  docker:image:Image flask-dockerimage creating 37bf9e16c9fc: Preparing
+  docker:image:Image flask-dockerimage creating 86d25a24551e: Preparing
+  docker:image:Image flask-dockerimage creating dc1889a6560c: Preparing
+  docker:image:Image flask-dockerimage creating b7715857621b: Preparing
+  docker:image:Image flask-dockerimage creating 7560054c4860: Preparing
+  docker:image:Image flask-dockerimage creating 83743ed05e49: Preparing
+  docker:image:Image flask-dockerimage creating a9ffebc5be68: Preparing
+  docker:image:Image flask-dockerimage creating 27d9a6169c9f: Preparing
+  docker:image:Image flask-dockerimage creating b9557a3d31d9: Preparing
+  docker:image:Image flask-dockerimage creating c8f52965417f: Preparing
+  docker:image:Image flask-dockerimage creating 9cde96ca61c2: Preparing
+  docker:image:Image flask-dockerimage creating f3fd11fd6d6c: Preparing
+  docker:image:Image flask-dockerimage creating e553743c668b: Preparing
+  docker:image:Image flask-dockerimage creating 88af765ea71f: Preparing
+  docker:image:Image flask-dockerimage creating b47c358499df: Preparing
+  docker:image:Image flask-dockerimage creating cbd550635f44: Preparing
+  docker:image:Image flask-dockerimage creating 2efef025159b: Preparing
+  docker:image:Image flask-dockerimage creating 3acbf6947195: Preparing
+  docker:image:Image flask-dockerimage creating f90fe4978ca2: Preparing
+  docker:image:Image flask-dockerimage creating 88383b8e3cb5: Preparing
+  docker:image:Image flask-dockerimage creating e93627dfc607: Preparing
+  docker:image:Image flask-dockerimage creating 8f23b00cc77f: Preparing
+  docker:image:Image flask-dockerimage creating cf691a2ea3f9: Preparing
+  docker:image:Image flask-dockerimage creating 3d3e92e98337: Preparing
+  docker:image:Image flask-dockerimage creating 8967306e673e: Preparing
+  docker:image:Image flask-dockerimage creating 9794a3b3ed45: Preparing
+  docker:image:Image flask-dockerimage creating 5f77a51ade6a: Preparing
+  docker:image:Image flask-dockerimage creating e40d297cf5f8: Preparing
+  docker:image:Image flask-dockerimage creating 83743ed05e49: Waiting
+  docker:image:Image flask-dockerimage creating a9ffebc5be68: Waiting
+  docker:image:Image flask-dockerimage creating 27d9a6169c9f: Waiting
+  docker:image:Image flask-dockerimage creating b9557a3d31d9: Waiting
+  docker:image:Image flask-dockerimage creating c8f52965417f: Waiting
+  docker:image:Image flask-dockerimage creating 9cde96ca61c2: Waiting
+  docker:image:Image flask-dockerimage creating f3fd11fd6d6c: Waiting
+  docker:image:Image flask-dockerimage creating e553743c668b: Waiting
+  docker:image:Image flask-dockerimage creating 88af765ea71f: Waiting
+  docker:image:Image flask-dockerimage creating b47c358499df: Waiting
+  docker:image:Image flask-dockerimage creating cbd550635f44: Waiting
+  docker:image:Image flask-dockerimage creating 2efef025159b: Waiting
+  docker:image:Image flask-dockerimage creating 3acbf6947195: Waiting
+  docker:image:Image flask-dockerimage creating f90fe4978ca2: Waiting
+  docker:image:Image flask-dockerimage creating 88383b8e3cb5: Waiting
+  docker:image:Image flask-dockerimage creating e93627dfc607: Waiting
+  docker:image:Image flask-dockerimage creating 8f23b00cc77f: Waiting
+  docker:image:Image flask-dockerimage creating cf691a2ea3f9: Waiting
+  docker:image:Image flask-dockerimage creating 3d3e92e98337: Waiting
+  docker:image:Image flask-dockerimage creating 8967306e673e: Waiting
+  docker:image:Image flask-dockerimage creating 9794a3b3ed45: Waiting
+  docker:image:Image flask-dockerimage creating 5f77a51ade6a: Waiting
+  docker:image:Image flask-dockerimage creating e40d297cf5f8: Waiting
+  docker:image:Image flask-dockerimage creating b7715857621b: Layer already exists
+  docker:image:Image flask-dockerimage creating 37bf9e16c9fc: Layer already exists
+  docker:image:Image flask-dockerimage creating 7560054c4860: Layer already exists
+  docker:image:Image flask-dockerimage creating dc1889a6560c: Layer already exists
+  docker:image:Image flask-dockerimage creating 86d25a24551e: Layer already exists
+  docker:image:Image flask-dockerimage creating 27d9a6169c9f: Layer already exists
+  docker:image:Image flask-dockerimage creating 83743ed05e49: Layer already exists
+  docker:image:Image flask-dockerimage creating a9ffebc5be68: Layer already exists
+  docker:image:Image flask-dockerimage creating b9557a3d31d9: Layer already exists
+  docker:image:Image flask-dockerimage creating c8f52965417f: Layer already exists
+  docker:image:Image flask-dockerimage creating 9cde96ca61c2: Layer already exists
+  docker:image:Image flask-dockerimage creating e553743c668b: Layer already exists
+  docker:image:Image flask-dockerimage creating f3fd11fd6d6c: Layer already exists
+  docker:image:Image flask-dockerimage creating 88af765ea71f: Layer already exists
+  docker:image:Image flask-dockerimage creating b47c358499df: Layer already exists
+  docker:image:Image flask-dockerimage creating 3acbf6947195: Layer already exists
+  docker:image:Image flask-dockerimage creating 88383b8e3cb5: Layer already exists
+  docker:image:Image flask-dockerimage creating f90fe4978ca2: Layer already exists
+  docker:image:Image flask-dockerimage creating cbd550635f44: Layer already exists
+  docker:image:Image flask-dockerimage creating 2efef025159b: Layer already exists
+  docker:image:Image flask-dockerimage creating e93627dfc607: Layer already exists
+  docker:image:Image flask-dockerimage creating cf691a2ea3f9: Layer already exists
+  docker:image:Image flask-dockerimage creating 8f23b00cc77f: Layer already exists
+  docker:image:Image flask-dockerimage creating 3d3e92e98337: Layer already exists
+  docker:image:Image flask-dockerimage creating 8967306e673e: Layer already exists
+  docker:image:Image flask-dockerimage creating 9794a3b3ed45: Layer already exists
+  docker:image:Image flask-dockerimage creating e40d297cf5f8: Layer already exists
+  docker:image:Image flask-dockerimage creating 5f77a51ade6a: Layer already exists
+  docker:image:Image flask-dockerimage creating latest: digest: sha256:50ed2042914931c82c162ae6c561ff2ef80dd3d7221d6529f4ba245136d1f289 size: 6175
+  docker:image:Image flask-dockerimage creating Image push succeeded.
+  aws:ec2:Subnet app-vpc-subnet creating
+  aws:ec2:InternetGateway app-gateway creating
+  aws:ec2:SecurityGroup security-group creating
+  aws:alb:TargetGroup redis-targetgroup creating
+  aws:alb:TargetGroup flask-targetgroup creating
+  aws:ec2:Subnet app-vpc-subnet created
+  aws:alb:LoadBalancer redis-balancer creating
+  aws:alb:LoadBalancer flask-balancer creating
+  aws:ec2:InternetGateway app-gateway created
+  aws:alb:TargetGroup flask-targetgroup created
+  aws:alb:TargetGroup redis-targetgroup created
+  aws:ec2:RouteTable app-routetable creating
+  aws:ec2:RouteTable app-routetable created
+  aws:ec2:MainRouteTableAssociation app_routetable_association creating
+  aws:ec2:SecurityGroup security-group created
+  aws:ec2:MainRouteTableAssociation app_routetable_association created
+  aws:alb:LoadBalancer redis-balancer created
+  aws:alb:Listener redis-listener creating
+  aws:ecs:TaskDefinition flask-task-definition creating
+  aws:alb:Listener redis-listener created
+  aws:ecs:Service redis-service creating
+  aws:ecs:TaskDefinition flask-task-definition created
+  aws:ecs:Service redis-service created
+  aws:alb:LoadBalancer flask-balancer created
+  aws:alb:Listener flask-listener creating
+  aws:alb:Listener flask-listener created
+  aws:ecs:Service flask-service creating
+  aws:ecs:Service flask-service created
+  pulumi:pulumi:Stack voting-app-dev created

Diagnostics:
docker:image:Image (flask-dockerimage):
warning: #1 [internal] load build definition from Dockerfile
#1 sha256:d3021bcd600ba4245f6a4279e7806adba5daa4319fb6edcbe522216e1eaf2fac
#1 transferring dockerfile: 119B done
#1 DONE 0.0s

#2 [internal] load .dockerignore
#2 sha256:6c9153091837d211e86dd97816aa6579174f734d26f945203192f2e091bc99d5
#2 transferring context: 2B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/tiangolo/uwsgi-nginx-flask:python3.6
#3 sha256:0c2fa23bcb11452f95b5b29eb37f2d2bf90f1bc8956bd39d202248798f27ffd9
#3 ...

#4 [auth] tiangolo/uwsgi-nginx-flask:pull token for registry-1.docker.io
#4 sha256:21179d6c3a1a4dd59898034c557051364a39bfa71be130a98dff0f0715fce4d5
#4 DONE 0.0s

#3 [internal] load metadata for docker.io/tiangolo/uwsgi-nginx-flask:python3.6
#3 sha256:0c2fa23bcb11452f95b5b29eb37f2d2bf90f1bc8956bd39d202248798f27ffd9
#3 DONE 3.1s

#8 [1/3] FROM docker.io/tiangolo/uwsgi-nginx-flask:python3.6@sha256:98c838b9d7861245ca4035816e8deb0f4efa11bc5deb8bdd74df0ec0b2aa5836
#8 sha256:fb0e756144bb81a8b46d7c2c376c1f3fbc0fa0b273eaa09f5af61768fc83ca93
#8 DONE 0.0s

#6 [internal] load build context
#6 sha256:72a50bc5a2dcc9f8872558604baacef8d318e7e8489fd674387f8af673c2c751
#6 transferring context: 824B done
#6 DONE 0.0s

#5 [2/3] RUN  pip install redis
#5 sha256:45bba08ebebb5c1b258fddf51df2c571539058099c122c1d6255bbd5c1481cd5
#5 CACHED

#7 [3/3] COPY /app /app
#7 sha256:75209e1cd647236cef1382d0557ccb01e162422bada4aa5f2d46d5ae55303cbf
#7 CACHED

#9 exporting to image
#9 sha256:e8c613e07b0b7ff33893b694f7759a10d42e180f2b4dc349fb57dc6b71dcab00
#9 exporting layers done
#9 writing image sha256:8797dbded82bcf707f002103c4fd4e1e0cadc46585882e2aed5125e08da76e3c done
#9 naming to 616138583583.dkr.ecr.us-west-2.amazonaws.com/app-ecr-repo-d04e506 done
#9 DONE 0.0s

Outputs:
app-url: "flask-balancer-470c0d7-a3f78d2a55370638.elb.us-west-2.amazonaws.com"

Resources:
+ 26 created

Duration: 4m42s

update summary: 
{
    "create": 26
}
app url: flask-balancer-470c0d7-a3f78d2a55370638.elb.us-west-2.amazonaws.com
```

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ venv/bin/python main.py destroy
preparing virtual environment...
virtual environment is ready!
successfully initialized stack
setting up config
config set
refreshing stack
Refreshing (dev)

View Live: https://app.pulumi.com/komalali/voting-app/dev/updates/3


~  pulumi:pulumi:Stack voting-app-dev refreshing
pulumi:pulumi:Stack voting-app-dev running
~  docker:image:Image flask-dockerimage refreshing
~  aws:iam:RolePolicyAttachment app-exec-policy refreshing
~  aws:iam:RolePolicyAttachment app-lambda-policy refreshing
docker:image:Image flask-dockerimage
~  aws:iam:RolePolicyAttachment app-access-policy refreshing
~  aws:iam:Role app-exec-role refreshing
~  aws:iam:Role app-task-role refreshing
~  aws:ecr:LifecyclePolicy app-lifecycle-policy refreshing
~  aws:ec2:InternetGateway app-gateway refreshing
~  aws:ec2:Subnet app-vpc-subnet refreshing
~  aws:ecr:Repository app-ecr-repo refreshing
~  aws:ecs:TaskDefinition redis-task-definition refreshing
~  aws:ec2:Vpc app-vpc refreshing
~  aws:ecs:Cluster app-cluster refreshing
~  aws:ec2:MainRouteTableAssociation app_routetable_association refreshing
~  aws:alb:TargetGroup flask-targetgroup refreshing
~  aws:alb:Listener redis-listener refreshing
~  aws:ec2:RouteTable app-routetable refreshing
~  aws:alb:TargetGroup redis-targetgroup refreshing
~  aws:alb:LoadBalancer redis-balancer refreshing
~  aws:ecs:TaskDefinition flask-task-definition refreshing
~  aws:ec2:SecurityGroup security-group refreshing
~  aws:alb:Listener flask-listener refreshing
~  aws:alb:LoadBalancer flask-balancer refreshing
~  aws:ecs:Service redis-service refreshing
~  aws:ecs:Service flask-service refreshing
aws:ecr:LifecyclePolicy app-lifecycle-policy  [diff: ~policy]
aws:alb:Listener flask-listener  [diff: +sslPolicy~defaultActions]
aws:alb:Listener redis-listener  [diff: +sslPolicy~defaultActions]
aws:ecs:Service flask-service  [diff: +capacityProviderStrategies,deploymentController,healthCheckGracePeriodSeconds,iamRole,orderedPlacementStrategies,placementConstraints,platformVersion,propagateTags,tags~loadBalancers]
aws:ec2:SecurityGroup security-group  [diff: +namePrefix,tags~egress,ingress]
aws:ec2:InternetGateway app-gateway  [diff: +tags]
aws:ec2:MainRouteTableAssociation app_routetable_association
aws:ecs:Cluster app-cluster  [diff: +capacityProviders,defaultCapacityProviderStrategies,settings,tags]
aws:ec2:RouteTable app-routetable  [diff: +propagatingVgws,tags~routes]
aws:ecs:TaskDefinition flask-task-definition  [diff: +inferenceAccelerators,ipcMode,pidMode,placementConstraints,tags,volumes~containerDefinitions]
aws:ecs:TaskDefinition redis-task-definition  [diff: +inferenceAccelerators,ipcMode,pidMode,placementConstraints,tags,volumes~containerDefinitions]
aws:ecs:Service redis-service  [diff: +capacityProviderStrategies,deploymentController,healthCheckGracePeriodSeconds,iamRole,orderedPlacementStrategies,placementConstraints,platformVersion,propagateTags,tags~loadBalancers]
aws:ec2:Subnet app-vpc-subnet  [diff: +availabilityZone,availabilityZoneId,ipv6CidrBlock,outpostArn,tags]
aws:ecr:Repository app-ecr-repo  [diff: +encryptionConfigurations,imageScanningConfiguration,tags]
~  aws:alb:LoadBalancer redis-balancer updated [diff: +accessLogs,customerOwnedIpv4Pool,ipAddressType,subnetMappings,tags]
~  aws:alb:LoadBalancer flask-balancer updated [diff: +accessLogs,customerOwnedIpv4Pool,ipAddressType,subnetMappings,tags]
aws:alb:TargetGroup flask-targetgroup  [diff: +healthCheck,stickiness,tags]
aws:iam:RolePolicyAttachment app-exec-policy
aws:iam:RolePolicyAttachment app-access-policy
aws:iam:RolePolicyAttachment app-lambda-policy
aws:alb:TargetGroup redis-targetgroup  [diff: +healthCheck,stickiness,tags]
aws:iam:Role app-exec-role  [diff: +description,tags~assumeRolePolicy]
aws:iam:Role app-task-role  [diff: +description,tags~assumeRolePolicy]
~  aws:ec2:Vpc app-vpc updated [diff: +enableClassiclink,enableClassiclinkDnsSupport,tags]
pulumi:pulumi:Stack voting-app-dev

Outputs:
app-url: "flask-balancer-470c0d7-a3f78d2a55370638.elb.us-west-2.amazonaws.com"

Resources:
~ 3 updated
23 unchanged

Duration: 3s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/komalali/voting-app/dev/updates/4


-  aws:ecs:Service redis-service deleting
-  aws:ecs:Service flask-service deleting
-  aws:ecs:Service redis-service deleted
-  aws:ecs:Service flask-service deleted
-  aws:ec2:MainRouteTableAssociation app_routetable_association deleting
-  aws:alb:Listener flask-listener deleting
-  aws:ecs:TaskDefinition flask-task-definition deleting
-  aws:alb:Listener redis-listener deleting
-  aws:ec2:MainRouteTableAssociation app_routetable_association deleted
-  aws:alb:Listener flask-listener deleted
-  aws:ecs:TaskDefinition flask-task-definition deleted
-  aws:alb:Listener redis-listener deleted
-  aws:ec2:RouteTable app-routetable deleting
-  aws:alb:LoadBalancer flask-balancer deleting
-  aws:alb:LoadBalancer redis-balancer deleting
-  aws:ec2:RouteTable app-routetable deleted
-  aws:alb:LoadBalancer flask-balancer deleted
-  aws:alb:LoadBalancer redis-balancer deleted
-  aws:iam:RolePolicyAttachment app-lambda-policy deleting
-  aws:iam:RolePolicyAttachment app-access-policy deleting
-  aws:alb:TargetGroup redis-targetgroup deleting
-  aws:ec2:SecurityGroup security-group deleting
-  aws:iam:RolePolicyAttachment app-exec-policy deleting
-  aws:ecr:LifecyclePolicy app-lifecycle-policy deleting
-  aws:ec2:Subnet app-vpc-subnet deleting
-  aws:ec2:InternetGateway app-gateway deleting
-  aws:alb:TargetGroup flask-targetgroup deleting
-  aws:ecs:TaskDefinition redis-task-definition deleting
-  aws:alb:TargetGroup redis-targetgroup deleted
-  aws:iam:RolePolicyAttachment app-lambda-policy deleted
-  aws:iam:RolePolicyAttachment app-access-policy deleted
-  aws:ecr:LifecyclePolicy app-lifecycle-policy deleted
-  aws:iam:RolePolicyAttachment app-exec-policy deleted
-  aws:alb:TargetGroup flask-targetgroup deleted
-  aws:ec2:SecurityGroup security-group deleted
-  aws:ecs:TaskDefinition redis-task-definition deleted
-  aws:ec2:Subnet app-vpc-subnet deleted
-  aws:ec2:InternetGateway app-gateway deleted
-  aws:iam:Role app-exec-role deleting
-  aws:ec2:Vpc app-vpc deleting
-  aws:iam:Role app-task-role deleting
-  docker:image:Image flask-dockerimage deleting
-  aws:ecr:Repository app-ecr-repo deleting
-  aws:ecs:Cluster app-cluster deleting
-  aws:ec2:Vpc app-vpc deleted
-  aws:ecr:Repository app-ecr-repo deleted
-  aws:ecs:Cluster app-cluster deleted
-  aws:iam:Role app-exec-role deleted
-  aws:iam:Role app-task-role deleted
-  pulumi:pulumi:Stack voting-app-dev deleting
-  pulumi:pulumi:Stack voting-app-dev deleted
-  docker:image:Image flask-dockerimage deleted

Outputs:
- app-url: "flask-balancer-470c0d7-a3f78d2a55370638.elb.us-west-2.amazonaws.com"

Resources:
- 26 deleted

Duration: 9m30s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```

# Cross-Language Programs


This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program written in a __different__ language. Here the Automation API script is written in `python` while the AWS Fargate Pulumi program is written in `go`. This project sets up an automation program in `./automation` that contains a `main.py` file that can be invoked to perform the full deployment lifecycle including automatically creating and selecting stacks, setting config, update, refresh, etc. The Pulumi program deploys an ECS cluster, an ECR registry, builds and pushes a Docker image to the registry, and runs that image in a Fargate task exposed behind a load balancer. Our project layout looks like the following:

- `/app`: this is our dockerized (`go`) web server. Our Pulumi program will build and run this in a Fargate task.
- `/fargate`: our Pulumi CLI program written in `go`. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program. See [this guide](https://github.com/pulumi/examples/tree/master/aws-go-fargate) for CLI-driven deployment details.
- `/automation`: a `main.py` containing our Automation API deployment driver. This can be run like any normal `python` program: `python main.py` will invoke our program.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. Go 1.14 or later.
2. The AWS CLI, with appropriate credentials.
3. Docker

To run our automation program we `cd` to the `automation` directory, set up our virtual environment and run `python main.py`:

1. ```shell
   $ python3 -m venv venv
   ```
2. ```shell
   $ venv/bin/python3 -m pip install --upgrade pip
   ```
3. ```shell
   $ venv/bin/pip install -r requirements.txt
   ```
4. ```shell
   $ venv/bin/python main.py
   successfully initialized stack
    setting up config
    config set
    refreshing stack
    Refreshing (dev)
    
    View Live: https://app.pulumi.com/komalali/fargate/dev/updates/15
    
    
    
    Resources:
    
    Duration: 1s
    
    refresh complete
    updating stack...
    Updating (dev)
    
    View Live: https://app.pulumi.com/komalali/fargate/dev/updates/16
    
    
    +  pulumi:pulumi:Stack fargate-dev creating
    +  aws:ecs:Cluster app-cluster creating
    +  aws:iam:Role task-exec-role creating
    +  aws:ec2:SecurityGroup web-sg creating
    +  aws:ecr:Repository foo creating
    +  docker:image:Image my-image creating
    +  aws:elasticloadbalancingv2:TargetGroup web-tg creating
    +  aws:ecr:Repository foo created
    +  aws:iam:Role task-exec-role created
    +  aws:iam:RolePolicyAttachment task-exec-policy creating
    +  docker:image:Image my-image creating Starting docker build and push...
    +  docker:image:Image my-image creating Logging into registry...
    +  docker:image:Image my-image creating Executing docker version -f {{json .}}
    +  docker:image:Image my-image creating {"Client":{"Platform":{"Name":"Docker Engine - Community"},"CloudIntegration":"1.0.4","Version":"20.10.0","ApiVersion":"1.41","DefaultAPIVersion":"1.41","GitCommit":"7287ab3","GoVersion":"go1.13.15","Os":"darwin","Arch":"amd64","BuildTime":"Tue Dec  8 18:55:43 2020","Context":"default","Experimental":true},"Server":{"Platform":{"Name":"Docker Engine - Community"},"Components":[{"Name":"Engine","Version":"20.10.0","Details":{"ApiVersion":"1.41","Arch":"amd64","BuildTime":"Tue Dec  8 18:58:04 2020","Experimental":"false","GitCommit":"eeddea2","GoVersion":"go1.13.15","KernelVersion":"4.19.121-linuxkit","MinAPIVersion":"1.12","Os":"linux"}},{"Name":"containerd","Version":"v1.4.3","Details":{"GitCommit":"269548fa27e0089a8b8278fc4fc781d7f65a939b"}},{"Name":"runc","Version":"1.0.0-rc92","Details":{"GitCommit":"ff819c7e9184c13b7c2607fe6c30ae19403a7aff"}},{"Name":"docker-init","Version":"0.19.0","Details":{"GitCommit":"de40ad0"}}],"Version":"20.10.0","ApiVersion":"1.41","MinAPIVersion":"1.12","GitCommit":"eeddea2","GoVersion":"go1.13.15","Os":"linux","Arch":"amd64","KernelVersion":"4.19.121-linuxkit","BuildTime":"2020-12-08T18:58:04.000000000+00:00"}}
    +  docker:image:Image my-image creating Executing docker login
    +  aws:elasticloadbalancingv2:TargetGroup web-tg created
    +  docker:image:Image my-image creating Login Succeeded
    +  docker:image:Image my-image creating Building container image 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5: context=../app
    +  docker:image:Image my-image creating Executing docker build -f  ../app -t 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5
    +  aws:iam:RolePolicyAttachment task-exec-policy created
    +  aws:ec2:SecurityGroup web-sg created
    +  aws:elasticloadbalancingv2:LoadBalancer web-lb creating
    +  docker:image:Image my-image creating
    +  docker:image:Image my-image creating warning: #1 [internal] load build definition from Dockerfile
    +  docker:image:Image my-image creating Executing docker image inspect -f {{.Id}} 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5
    +  docker:image:Image my-image creating sha256:9b26a0404a4d61485a241867b6e816944b0e05c393eba54116a120410846893b
    +  docker:image:Image my-image creating Executing docker tag 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5:9b26a0404a4d61485a241867b6e816944b0e05c393eba54116a120410846893b
    +  docker:image:Image my-image creating
    +  docker:image:Image my-image creating Executing docker push 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5:9b26a0404a4d61485a241867b6e816944b0e05c393eba54116a120410846893b
    +  aws:ecs:Cluster app-cluster created
    +  docker:image:Image my-image creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5]
    +  docker:image:Image my-image creating Executing docker tag 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5
    +  docker:image:Image my-image creating
    +  docker:image:Image my-image creating Executing docker push 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-a16d3e5
    +  docker:image:Image my-image creating Using default tag: latest
    +  docker:image:Image my-image creating Successfully pushed to docker.
    +  aws:ecs:TaskDefinition app-task creating
    +  aws:ecs:TaskDefinition app-task created
    +  aws:elasticloadbalancingv2:LoadBalancer web-lb created
    +  aws:elasticloadbalancingv2:Listener web-listener creating
    +  aws:elasticloadbalancingv2:Listener web-listener created
    +  aws:ecs:Service app-svc creating
    +  aws:ecs:Service app-svc created
    +  pulumi:pulumi:Stack fargate-dev created
    
    Outputs:
    url: "web-lb-fb1b0ee-2061927142.us-west-2.elb.amazonaws.com"
    
    Resources:
    + 12 created
    
    Duration: 2m19s
    
    update summary: 
    {
        "create": 12
    }
    website url: web-lb-fb1b0ee-2061927142.us-west-2.elb.amazonaws.com

    
    
    $ curl web-lb-fb1b0ee-2061927142.us-west-2.elb.amazonaws.com
    47
    $ curl web-lb-fb1b0ee-2061927142.us-west-2.elb.amazonaws.com
    14
    ```
(note that the URL may take a minute or two to become reachable)

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ venv/bin/python main.py destroy
successfully initialized stack
setting up config
config set
refreshing stack
Refreshing (dev)

View Live: https://app.pulumi.com/komalali/fargate/dev/updates/17


~  pulumi:pulumi:Stack fargate-dev refreshing
pulumi:pulumi:Stack fargate-dev running
~  docker:image:Image my-image refreshing
docker:image:Image my-image
~  aws:iam:Role task-exec-role refreshing
~  aws:ecr:Repository foo refreshing
~  aws:iam:RolePolicyAttachment task-exec-policy refreshing
~  aws:ecs:Cluster app-cluster refreshing
~  aws:elasticloadbalancingv2:Listener web-listener refreshing
~  aws:ecs:TaskDefinition app-task refreshing
~  aws:elasticloadbalancingv2:TargetGroup web-tg refreshing
~  aws:elasticloadbalancingv2:LoadBalancer web-lb refreshing
~  aws:ec2:SecurityGroup web-sg refreshing
~  aws:ecs:Service app-svc refreshing
aws:elasticloadbalancingv2:Listener web-listener  [diff: +sslPolicy~defaultActions]
aws:ecs:TaskDefinition app-task  [diff: +inferenceAccelerators,ipcMode,pidMode,placementConstraints,tags,taskRoleArn,volumes~containerDefinitions]
aws:ecs:Cluster app-cluster  [diff: +capacityProviders,defaultCapacityProviderStrategies,settings,tags]
aws:ec2:SecurityGroup web-sg  [diff: +namePrefix,tags~egress,ingress]
aws:ecs:Service app-svc  [diff: +capacityProviderStrategies,deploymentController,healthCheckGracePeriodSeconds,iamRole,orderedPlacementStrategies,placementConstraints,platformVersion,propagateTags,tags~loadBalancers]
aws:ecr:Repository foo  [diff: +encryptionConfigurations,imageScanningConfiguration,tags]
~  aws:elasticloadbalancingv2:LoadBalancer web-lb updated [diff: +accessLogs,internal,ipAddressType,subnetMappings,tags]
aws:elasticloadbalancingv2:TargetGroup web-tg  [diff: +healthCheck,loadBalancingAlgorithmType,stickiness,tags]
aws:iam:RolePolicyAttachment task-exec-policy
aws:iam:Role task-exec-role  [diff: +description,tags~assumeRolePolicy]
pulumi:pulumi:Stack fargate-dev

Outputs:
url: "web-lb-fb1b0ee-2061927142.us-west-2.elb.amazonaws.com"

Resources:
~ 1 updated
11 unchanged

Duration: 2s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/komalali/fargate/dev/updates/18


-  aws:ecs:Service app-svc deleting
-  aws:ecs:Service app-svc deleted
-  aws:elasticloadbalancingv2:Listener web-listener deleting
-  aws:elasticloadbalancingv2:Listener web-listener deleted
-  aws:iam:RolePolicyAttachment task-exec-policy deleting
-  aws:ecs:TaskDefinition app-task deleting
-  aws:elasticloadbalancingv2:LoadBalancer web-lb deleting
-  aws:ecs:TaskDefinition app-task deleted
-  aws:iam:RolePolicyAttachment task-exec-policy deleted
-  aws:elasticloadbalancingv2:LoadBalancer web-lb deleted
-  docker:image:Image my-image deleting
-  aws:ecs:Cluster app-cluster deleting
-  aws:ecr:Repository foo deleting
-  aws:ec2:SecurityGroup web-sg deleting
-  aws:iam:Role task-exec-role deleting
-  aws:elasticloadbalancingv2:TargetGroup web-tg deleting
-  aws:ecs:Cluster app-cluster deleted
-  aws:ecr:Repository foo deleted
-  aws:elasticloadbalancingv2:TargetGroup web-tg deleted
-  aws:iam:Role task-exec-role deleted
-  aws:ec2:SecurityGroup web-sg deleted
-  pulumi:pulumi:Stack fargate-dev deleting
-  docker:image:Image my-image deleted
-  pulumi:pulumi:Stack fargate-dev deleted

Outputs:
- url: "web-lb-fb1b0ee-2061927142.us-west-2.elb.amazonaws.com"

Resources:
- 12 deleted

Duration: 6m52s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete

```

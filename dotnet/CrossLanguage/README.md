# Cross-Language Programs

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program written in a __different__ language. Here the Automation API script is written in `csharp` while the AWS Fargate Pulumi program is written in `go`. This project sets up an automation program in `./automation` that contains a .NET console application that can be invoked to perform the full deployment lifecycle including automatically creating and selecting stacks, setting config, update, refresh, etc. The Pulumi program deploys an ECS cluster, an ECR registry, builds and pushes a Docker image to the registry, and runs that image in a Fargate task exposed behind a load balancer. Our project layout looks like the following:

- `/fargate`: our Pulumi CLI program written in `go`. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program. See [this guide](https://github.com/pulumi/examples/tree/master/aws-go-fargate) for CLI-driven deployment details.
- `/fargate/app`: this is our dockerized (`go`) web server. Our Pulumi program will build and run this in a Fargate task.
- `/automation`: a .NET console application containing our Automation API deployment driver. This can be run like any normal .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. The .NET SDK, this console application is targetting .NET Core 6.0.

To run our automation program we `cd` to the `automation` directory...

```shell
C:\code\pulumi-automation-examples\CrossLanguage\automation> dotnet run
successfully initialized stack
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/fargate/dev/updates/12



Resources:

Duration: 0s

refresh complete
updating stack...
Updating (dev)

View Live: https://app.pulumi.com/joshstudt/fargate/dev/updates/13


 +  pulumi:pulumi:Stack fargate-dev creating
 +  aws:ecs:Cluster app-cluster creating
 +  aws:iam:Role task-exec-role creating
 +  aws:ec2:SecurityGroup web-sg creating
 +  aws:ecr:Repository foo creating
 +  docker:image:Image my-image creating
 +  aws:elasticloadbalancingv2:TargetGroup web-tg creating
 +  aws:iam:Role task-exec-role created
 +  aws:iam:RolePolicyAttachment task-exec-policy creating
 +  aws:iam:RolePolicyAttachment task-exec-policy created
 +  aws:ecr:Repository foo created
 +  docker:image:Image my-image creating Starting docker build and push...
 +  docker:image:Image my-image creating Logging into registry...
 +  docker:image:Image my-image creating Executing docker version -f {{json .}}
 +  aws:elasticloadbalancingv2:TargetGroup web-tg created
 +  docker:image:Image my-image creating {"Client":{"Platform":{"Name":"Docker Engine - Community"},"CloudIntegration":"1.0.7","Version":"20.10.2","ApiVersion":"1.41","DefaultAPIVersion":"1.41","GitCommit":"2291f61","GoVersion":"go1.13.15","Os":"windows","Arch":"amd64","BuildTime":"Mon Dec 28 16:14:16 2020","Context":"default","Experimental":true},"Server":{"Platform":{"Name":"Docker Engine - Community"},"Components":[{"Name":"Engine","Version":"20.10.2","Details":{"ApiVersion":"1.41","Arch":"amd64","BuildTime":"Mon Dec 28 16:15:28 2020","Experimental":"false","GitCommit":"8891c58","GoVersion":"go1.13.15","KernelVersion":"4.19.121-linuxkit","MinAPIVersion":"1.12","Os":"linux"}},{"Name":"containerd","Version":"1.4.3","Details":{"GitCommit":"269548fa27e0089a8b8278fc4fc781d7f65a939b"}},{"Name":"runc","Version":"1.0.0-rc92","Details":{"GitCommit":"ff819c7e9184c13b7c2607fe6c30ae19403a7aff"}},{"Name":"docker-init","Version":"0.19.0","Details":{"GitCommit":"de40ad0"}}],"Version":"20.10.2","ApiVersion":"1.41","MinAPIVersion":"1.12","GitCommit":"8891c58","GoVersion":"go1.13.15","Os":"linux","Arch":"amd64","KernelVersion":"4.19.121-linuxkit","BuildTime":"2020-12-28T16:15:28.000000000+00:00"}}
 +  docker:image:Image my-image creating Executing docker login
 +  aws:ec2:SecurityGroup web-sg created
 +  aws:elasticloadbalancingv2:LoadBalancer web-lb creating
 +  docker:image:Image my-image creating Login Succeeded
 +  docker:image:Image my-image creating Building container image 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8: context=app
 +  docker:image:Image my-image creating Executing docker build -f  app -t 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8
 +  docker:image:Image my-image creating Sending build context to Docker daemon  5.632kB

 +  docker:image:Image my-image creating Executing docker image inspect -f {{.Id}} 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8
 +  docker:image:Image my-image creating sha256:131a292751ce7f960b1fe90a2a1daf086ba28d831e094c0b38133d0273892ee6
 +  docker:image:Image my-image creating Executing docker tag 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8:131a292751ce7f960b1fe90a2a1daf086ba28d831e094c0b38133d0273892ee6
 +  aws:ecs:Cluster app-cluster created
 +  docker:image:Image my-image creating
 +  docker:image:Image my-image creating Executing docker push 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8:131a292751ce7f960b1fe90a2a1daf086ba28d831e094c0b38133d0273892ee6
 +  aws:elasticloadbalancingv2:LoadBalancer web-lb created
 +  aws:elasticloadbalancingv2:Listener web-listener creating
 +  aws:elasticloadbalancingv2:Listener web-listener created
 +  docker:image:Image my-image creating The push refers to repository [847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8]
 +  docker:image:Image my-image creating Executing docker tag 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8
 +  docker:image:Image my-image creating
 +  docker:image:Image my-image creating Executing docker push 847581877987.dkr.ecr.us-west-2.amazonaws.com/foo-4e88fa8
 +  docker:image:Image my-image creating Using default tag: latest
 +  docker:image:Image my-image creating Successfully pushed to docker.
 +  aws:ecs:TaskDefinition app-task creating
 +  aws:ecs:TaskDefinition app-task created
 +  aws:ecs:Service app-svc creating
 +  aws:ecs:Service app-svc created
 +  pulumi:pulumi:Stack fargate-dev created

Outputs:
    url: "web-lb-7508879-552272703.us-west-2.elb.amazonaws.com"

Resources:
    + 12 created

Duration: 2m56s

update summary:
    Create: 12
website url: web-lb-7508879-552272703.us-west-2.elb.amazonaws.com
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
C:\code\pulumi-automation-examples\CrossLanguage\automation> dotnet run destroy
successfully initialized stack
setting up config...
config set
refreshing stack...
Refreshing (dev)

View Live: https://app.pulumi.com/joshstudt/fargate/dev/updates/14


 ~  pulumi:pulumi:Stack fargate-dev refreshing
 ~  docker:image:Image my-image refreshing
    pulumi:pulumi:Stack fargate-dev running
 ~  aws:iam:RolePolicyAttachment task-exec-policy refreshing
    docker:image:Image my-image
 ~  aws:ecs:Cluster app-cluster refreshing
 ~  aws:iam:Role task-exec-role refreshing
 ~  aws:ecr:Repository foo refreshing
 ~  aws:elasticloadbalancingv2:TargetGroup web-tg refreshing
 ~  aws:elasticloadbalancingv2:Listener web-listener refreshing
 ~  aws:ecs:TaskDefinition app-task refreshing
 ~  aws:ec2:SecurityGroup web-sg refreshing
 ~  aws:ecs:Service app-svc refreshing
 ~  aws:elasticloadbalancingv2:LoadBalancer web-lb refreshing
    aws:iam:RolePolicyAttachment task-exec-policy
    aws:iam:Role task-exec-role  [diff: +description,tags~assumeRolePolicy]
    aws:elasticloadbalancingv2:Listener web-listener  [diff: +sslPolicy~defaultActions]
    aws:ec2:SecurityGroup web-sg  [diff: +namePrefix,tags~egress,ingress]
    aws:ecs:Cluster app-cluster  [diff: +capacityProviders,defaultCapacityProviderStrategies,settings,tags]
    aws:ecs:TaskDefinition app-task  [diff: +inferenceAccelerators,ipcMode,pidMode,placementConstraints,tags,taskRoleArn,volumes~containerDefinitions]
    aws:ecs:Service app-svc  [diff: +capacityProviderStrategies,deploymentController,healthCheckGracePeriodSeconds,iamRole,orderedPlacementStrategies,placementConstraints,platformVersion,propagateTags,tags~loadBalancers]
    aws:ecr:Repository foo  [diff: +encryptionConfigurations,imageScanningConfiguration,tags]
 ~  aws:elasticloadbalancingv2:LoadBalancer web-lb updated [diff: +accessLogs,internal,ipAddressType,subnetMappings,tags]
    aws:elasticloadbalancingv2:TargetGroup web-tg  [diff: +healthCheck,loadBalancingAlgorithmType,stickiness,tags]
    pulumi:pulumi:Stack fargate-dev

Outputs:
    url: "web-lb-7508879-552272703.us-west-2.elb.amazonaws.com"

Resources:
    ~ 1 updated
    11 unchanged

Duration: 3s

refresh complete
destroying stack...
Destroying (dev)

View Live: https://app.pulumi.com/joshstudt/fargate/dev/updates/15


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
 -  aws:ecr:Repository foo deleting
 -  aws:ecs:Cluster app-cluster deleting
 -  aws:iam:Role task-exec-role deleting
 -  aws:ec2:SecurityGroup web-sg deleting
 -  aws:elasticloadbalancingv2:TargetGroup web-tg deleting
 -  aws:iam:Role task-exec-role deleted
 -  aws:ecr:Repository foo deleted
 -  aws:ecs:Cluster app-cluster deleted
 -  aws:elasticloadbalancingv2:TargetGroup web-tg deleted
 -  aws:ec2:SecurityGroup web-sg deleted
 -  pulumi:pulumi:Stack fargate-dev deleting
 -  pulumi:pulumi:Stack fargate-dev deleted
 -  docker:image:Image my-image deleted

Outputs:
  - url: "web-lb-7508879-552272703.us-west-2.elb.amazonaws.com"

Resources:
    - 12 deleted

Duration: 6m53s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```
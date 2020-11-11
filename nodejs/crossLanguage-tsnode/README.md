# Cross-Language Programs


This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program written in a __different__ language. Here the Automation API script is written in `typescript` while the AWS Fargate Pulumi program is written in `go`. This project sets up an automation program in `./automation` that contains an `index.ts` file that can be invoked to perform the full deployment lifecycle including automatically creating and selecting stacks, setting config, update, refresh, etc. The Pulumi program deploys an ECS cluster, an ECR registry, builds and pushes a Docker image to the registry, and runs that image in a Fargate task exposed behind a load balancer. Our project layout looks like the following:

- `/app`: this is our dockerized (`go`) web server. Our Pulumi program will build and run this in a Fargate task.
- `/fargate`: our Pulumi CLI program written in `go`. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program. See [this guide](https://github.com/pulumi/examples/tree/master/aws-go-fargate) for CLI-driven deployment details.
- `/automation`: an `index.ts` containing our Automation API deployment driver. This can be run like any normal `typescript` program: `yarn run start` will invoke our program with `ts-node`.

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.12.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. Go 1.14 or later.
2. The AWS CLI, with appropriate credentials.
3. Docker

To run our automation program we just `cd` to the `automation` directory and `yarn run start`:

```shell
$ yarn install
$ yarn start
yarn run v1.19.1
$ ./node_modules/ts-node/dist/bin.js index.ts
successfully initialized stack
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/fargate/dev/updates/23






refresh complete
updating stack...
Updating (dev)


View Live: https://app.pulumi.com/EvanBoyle/fargate/dev/updates/24




 +  pulumi:pulumi:Stack fargate-dev creating

 +  aws:ecs:Cluster app-cluster creating

 +  aws:iam:Role task-exec-role creating

 +  aws:ec2:SecurityGroup web-sg creating

 +  aws:elasticloadbalancingv2:TargetGroup web-tg creating

 +  docker:image:Image my-image creating

 +  aws:ecr:Repository foo creating

 +  aws:ecr:Repository foo created

 +  aws:elasticloadbalancingv2:TargetGroup web-tg created

 +  aws:iam:Role task-exec-role created

 +  docker:image:Image my-image creating Starting docker build and push...

 +  docker:image:Image my-image creating Logging into registry...

 +  docker:image:Image my-image creating Executing docker version -f {{json .}}

 +  aws:iam:RolePolicyAttachment task-exec-policy creating

 +  docker:image:Image my-image creating {"Client":{"Platform":{"Name":"Docker Engine - Community"},"Version":"19.03.12","ApiVersion":"1.40","DefaultAPIVersion":"1.40","GitCommit":"48a66213fe","GoVersion":"go1.13.10","Os":"darwin","Arch":"amd64","BuildTime":"Mon Jun 22 15:41:33 2020","Experimental":false},"Server":{"Platform":{"Name":"Docker Engine - Community"},"Components":[{"Name":"Engine","Version":"19.03.12","Details":{"ApiVersion":"1.40","Arch":"amd64","BuildTime":"Mon Jun 22 15:49:27 2020","Experimental":"false","GitCommit":"48a66213fe","GoVersion":"go1.13.10","KernelVersion":"4.19.76-linuxkit","MinAPIVersion":"1.12","Os":"linux"}},{"Name":"containerd","Version":"v1.2.13","Details":{"GitCommit":"7ad184331fa3e55e52b890ea95e65ba581ae3429"}},{"Name":"runc","Version":"1.0.0-rc10","Details":{"GitCommit":"dc9208a3303feef5b3839f4323d9beb36df0a9dd"}},{"Name":"docker-init","Version":"0.18.0","Details":{"GitCommit":"fec3683"}}],"Version":"19.03.12","ApiVersion":"1.40","MinAPIVersion":"1.12","GitCommit":"48a66213fe","GoVersion":"go1.13.10","Os":"linux","Arch":"amd64","KernelVersion":"4.19.76-linuxkit","BuildTime":"2020-06-22T15:49:27.000000000+00:00"}}

 +  docker:image:Image my-image creating Executing docker login

 +  docker:image:Image my-image creating Login Succeeded

 +  docker:image:Image my-image creating Building container image 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab: context=../app

 +  docker:image:Image my-image creating Executing docker build -f  ../app -t 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab

 +  aws:iam:RolePolicyAttachment task-exec-policy created

 +  docker:image:Image my-image creating Sending build context to Docker daemon  5.632kB

 +  docker:image:Image my-image creating Executing docker image inspect -f {{.Id}} 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab

 +  docker:image:Image my-image creating sha256:4947495309c29c3616bf6b5f32a2ea1e2fc6a30ed8408c9709d6480f4fc770a9

 +  aws:ec2:SecurityGroup web-sg created
 +  docker:image:Image my-image creating Executing docker tag 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab:4947495309c29c3616bf6b5f32a2ea1e2fc6a30ed8408c9709d6480f4fc770a9

 +  docker:image:Image my-image creating

 +  docker:image:Image my-image creating Executing docker push 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab:4947495309c29c3616bf6b5f32a2ea1e2fc6a30ed8408c9709d6480f4fc770a9

 +  aws:elasticloadbalancingv2:LoadBalancer web-lb creating

@ Updating....

 +  aws:ecs:Cluster app-cluster created

@ Updating....

 +  docker:image:Image my-image creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab]

 +  docker:image:Image my-image creating Executing docker tag 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab

 +  docker:image:Image my-image creating

 +  docker:image:Image my-image creating Executing docker push 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab

 +  docker:image:Image my-image creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-fdf62ab]

 +  docker:image:Image my-image creating Successfully pushed to docker.

 +  aws:ecs:TaskDefinition app-task creating

 +  aws:ecs:TaskDefinition app-task created

@ Updating....
.
.
.
.

 +  aws:elasticloadbalancingv2:LoadBalancer web-lb created

 +  aws:elasticloadbalancingv2:Listener web-listener creating

 +  aws:elasticloadbalancingv2:Listener web-listener created

 +  aws:ecs:Service app-svc creating

 +  aws:ecs:Service app-svc created

 +  pulumi:pulumi:Stack fargate-dev created


Outputs:
    url: "web-lb-e14eae2-814897922.us-west-2.elb.amazonaws.com"

Resources:
    + 12 created

Duration: 2m26s


update summary:
{
    "create": 12
}
website url: web-lb-e14eae2-814897922.us-west-2.elb.amazonaws.com
✨  Done in 151.93s.


$ curl web-lb-e14eae2-814897922.us-west-2.elb.amazonaws.com
47
$ curl web-lb-e14eae2-814897922.us-west-2.elb.amazonaws.com
14
```
(note that the URL may take a minute or two to become reachable)

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ yarn start destroy
yarn run v1.19.1
$ ./node_modules/ts-node/dist/bin.js index.ts destroy
successfully initialized stack
setting up config
config set
refreshing stack...
Refreshing (dev)


View Live: https://app.pulumi.com/EvanBoyle/fargate/dev/updates/25




 ~  pulumi:pulumi:Stack fargate-dev refreshing

 ~  docker:image:Image my-image refreshing

    pulumi:pulumi:Stack fargate-dev running

    docker:image:Image my-image

 ~  aws:iam:RolePolicyAttachment task-exec-policy refreshing

 ~  aws:ecr:Repository foo refreshing

 ~  aws:ecs:TaskDefinition app-task refreshing

 ~  aws:elasticloadbalancingv2:TargetGroup web-tg refreshing

 ~  aws:iam:Role task-exec-role refreshing

 ~  aws:ecs:Cluster app-cluster refreshing

 ~  aws:elasticloadbalancingv2:Listener web-listener refreshing

 ~  aws:ec2:SecurityGroup web-sg refreshing

 ~  aws:elasticloadbalancingv2:LoadBalancer web-lb refreshing

 ~  aws:ecs:Service app-svc refreshing

    aws:ecs:TaskDefinition app-task  [diff: +inferenceAccelerators,ipcMode,pidMode,placementConstraints,tags,taskRoleArn,volumes~containerDefinitions]

    aws:elasticloadbalancingv2:Listener web-listener  [diff: +sslPolicy~defaultActions]

    aws:ecs:Cluster app-cluster  [diff: +capacityProviders,defaultCapacityProviderStrategies,settings,tags]

    aws:ecs:Service app-svc  [diff: +capacityProviderStrategies,deploymentController,healthCheckGracePeriodSeconds,iamRole,orderedPlacementStrategies,placementConstraints,platformVersion,propagateTags,tags~loadBalancers]

    aws:ec2:SecurityGroup web-sg  [diff: +namePrefix,tags~egress,ingress]

    aws:ecr:Repository foo  [diff: +encryptionConfigurations,imageScanningConfiguration,tags]

    aws:elasticloadbalancingv2:TargetGroup web-tg  [diff: +healthCheck,loadBalancingAlgorithmType,stickiness,tags]

 ~  aws:elasticloadbalancingv2:LoadBalancer web-lb updated [diff: +accessLogs,internal,ipAddressType,subnetMappings,tags]

    aws:iam:Role task-exec-role  [diff: +description,tags~assumeRolePolicy]

    aws:iam:RolePolicyAttachment task-exec-policy

    pulumi:pulumi:Stack fargate-dev


Outputs:
    url: "web-lb-e14eae2-814897922.us-west-2.elb.amazonaws.com"

Resources:
    ~ 1 updated
    11 unchanged

Duration: 2s


refresh complete
destroying stack...
Destroying (dev)


View Live: https://app.pulumi.com/EvanBoyle/fargate/dev/updates/26




 -  aws:ecs:Service app-svc deleting

@ Destroying....
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.

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

 -  aws:iam:Role task-exec-role deleting

 -  aws:elasticloadbalancingv2:TargetGroup web-tg deleting

 -  aws:ecs:Cluster app-cluster deleting

 -  aws:ecr:Repository foo deleting

 -  aws:ec2:SecurityGroup web-sg deleting

 -  aws:elasticloadbalancingv2:TargetGroup web-tg deleted

 -  aws:ecs:Cluster app-cluster deleted

 -  aws:ecr:Repository foo deleted

 -  aws:iam:Role task-exec-role deleted

@ Destroying....

 -  aws:ec2:SecurityGroup web-sg deleted

 -  pulumi:pulumi:Stack fargate-dev deleting

 -  docker:image:Image my-image deleted
 -  pulumi:pulumi:Stack fargate-dev deleted


Outputs:
  - url: "web-lb-e14eae2-814897922.us-west-2.elb.amazonaws.com"

Resources:
    - 12 deleted

Duration: 7m12s


The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.

stack destroy complete
✨  Done in 437.56s.
```

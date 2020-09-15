# Local Program

This example demonstrates adding an Automation API driver to an existing Pulumi CLI-driven program. This project sets up an automation driver in `./automation` that contains a `main.go` file that can be invoked to preform the full deployment lifecycle including automatically selecting creating/selecting stacks, setting config, update, refresh, etc. Our Pulumi program deploys an ECS cluster, an ECR registry, builds and pushes a Docker image to the registry, and runs that image in a Fargate task exposed behind a load balancer. Our project layout looks like the following:

- `/app`: this is our dockerized web server. Our pulumi program will build and run this in a Fargate task.
- `/fargate`: our Pulumi CLI program. If you'd like, you can deploy this and work with it like you would any other Pulumi CLI program. See [this guide](https://github.com/pulumi/examples/tree/master/aws-go-fargate) for CLI-driven deployment details.
- `/automation`: a `main.go` containing our Automation API deployment driver. This can be run like any normal go program: `go run main.go`

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v2.9.2](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The AWS CLI, with appropriate credentials.
3. Docker

To run our automation program we just `cd` to the directory and `go run main.go`:

```shell
$ go run main.go
Created/Selected stack "dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting update
Updating (dev)

View Live: https://app.pulumi.com/EvanBoyle/fargate/dev/updates/14


@ Updating.....
 +  pulumi:pulumi:Stack fargate-dev creating 
 +  aws:ecs:Cluster app-cluster creating 
 +  aws:iam:Role task-exec-role creating 
 +  docker:image:Image my-image creating 
 +  aws:ecr:Repository foo creating 
 +  aws:ec2:SecurityGroup web-sg creating 
 +  aws:elasticloadbalancingv2:TargetGroup web-tg creating 
 +  aws:ecr:Repository foo created 
 +  docker:image:Image my-image creating Starting docker build and push...
 +  docker:image:Image my-image creating Logging into registry...
 +  docker:image:Image my-image creating Executing docker version -f {{json .}}
 +  docker:image:Image my-image creating {"Client":{"Platform":{"Name":"Docker Engine - Community"},"Version":"19.03.12","ApiVersion":"1.40","DefaultAPIVersion":"1.40","GitCommit":"48a66213fe","GoVersion":"go1.13.10","Os":"darwin","Arch":"amd64","BuildTime":"Mon Jun 22 15:41:33 2020","Experimental":false},"Server":{"Platform":{"Name":"Docker Engine - Community"},"Components":[{"Name":"Engine","Version":"19.03.12","Details":{"ApiVersion":"1.40","Arch":"amd64","BuildTime":"Mon Jun 22 15:49:27 2020","Experimental":"false","GitCommit":"48a66213fe","GoVersion":"go1.13.10","KernelVersion":"4.19.76-linuxkit","MinAPIVersion":"1.12","Os":"linux"}},{"Name":"containerd","Version":"v1.2.13","Details":{"GitCommit":"7ad184331fa3e55e52b890ea95e65ba581ae3429"}},{"Name":"runc","Version":"1.0.0-rc10","Details":{"GitCommit":"dc9208a3303feef5b3839f4323d9beb36df0a9dd"}},{"Name":"docker-init","Version":"0.18.0","Details":{"GitCommit":"fec3683"}}],"Version":"19.03.12","ApiVersion":"1.40","MinAPIVersion":"1.12","GitCommit":"48a66213fe","GoVersion":"go1.13.10","Os":"linux","Arch":"amd64","KernelVersion":"4.19.76-linuxkit","BuildTime":"2020-06-22T15:49:27.000000000+00:00"}}
 +  docker:image:Image my-image creating Executing docker login
 +  aws:iam:Role task-exec-role created 
 +  aws:iam:RolePolicyAttachment task-exec-policy creating 
 +  aws:elasticloadbalancingv2:TargetGroup web-tg created 
 +  docker:image:Image my-image creating Login Succeeded
 +  docker:image:Image my-image creating Building container image 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f: context=../app
 +  docker:image:Image my-image creating Executing docker build -f  ../app -t 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f
 +  aws:ec2:SecurityGroup web-sg created 
 +  aws:elasticloadbalancingv2:LoadBalancer web-lb creating 
 +  aws:iam:RolePolicyAttachment task-exec-policy created 
 +  docker:image:Image my-image creating Sending build context to Docker daemon  5.632kB
 +  docker:image:Image my-image creating Executing docker image inspect -f {{.Id}} 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f
 +  docker:image:Image my-image creating sha256:579ded06409fc3ac6757fffb9600606367984e1a7373349dedaf592a2037e086
 +  docker:image:Image my-image creating Executing docker tag 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f:579ded06409fc3ac6757fffb9600606367984e1a7373349dedaf592a2037e086
 +  docker:image:Image my-image creating 
 +  docker:image:Image my-image creating Executing docker push 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f:579ded06409fc3ac6757fffb9600606367984e1a7373349dedaf592a2037e086
 +  aws:ecs:Cluster app-cluster created 
@ Updating....
 +  docker:image:Image my-image creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f]
 +  docker:image:Image my-image creating Executing docker tag 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f
 +  docker:image:Image my-image creating 
 +  docker:image:Image my-image creating Executing docker push 616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f
 +  docker:image:Image my-image creating The push refers to repository [616138583583.dkr.ecr.us-west-2.amazonaws.com/foo-178e68f]
 +  docker:image:Image my-image creating Successfully pushed to docker.
 +  aws:ecs:TaskDefinition app-task creating 
 +  aws:ecs:TaskDefinition app-task created 
@ Updating.........
 +  aws:elasticloadbalancingv2:LoadBalancer web-lb created 
 +  aws:elasticloadbalancingv2:Listener web-listener creating 
 +  aws:elasticloadbalancingv2:Listener web-listener created 
 +  aws:ecs:Service app-svc creating 
 +  aws:ecs:Service app-svc created 
 +  pulumi:pulumi:Stack fargate-dev created 
 
Outputs:
    url: "web-lb-06b2a4a-609955359.us-west-2.elb.amazonaws.com"

Resources:
    + 12 created

Duration: 3m14s

Update succeeded!
URL: web-lb-06b2a4a-609955359.us-west-2.elb.amazonaws.com

$ curl web-lb-804c6d4-1601331384.us-west-2.elb.amazonaws.com
47
$ curl web-lb-804c6d4-1601331384.us-west-2.elb.amazonaws.com
14
```
(note that the URL may take a minute or two to become reachable)

To destroy our stack, we run our automation program with an additional `destroy` argument:

```shell
$ go run main.go destroy 
Created/Selected stack "dev"
Successfully set config
Starting refresh
Refresh succeeded!
Starting stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/EvanBoyle/fargate/dev/updates/16


 -  aws:ecs:Service app-svc deleting 
@ Destroying......................
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
 -  aws:ecs:Cluster app-cluster deleting 
 -  aws:elasticloadbalancingv2:TargetGroup web-tg deleting 
 -  aws:ec2:SecurityGroup web-sg deleting 
 -  aws:ecr:Repository foo deleting 
 -  aws:elasticloadbalancingv2:TargetGroup web-tg deleted 
 -  aws:ecs:Cluster app-cluster deleted 
 -  aws:ecr:Repository foo deleted 
 -  aws:iam:Role task-exec-role deleted 
@ Destroying.....
 -  aws:ec2:SecurityGroup web-sg deleted 
 -  pulumi:pulumi:Stack fargate-dev deleting 
 -  docker:image:Image my-image deleted 
 -  pulumi:pulumi:Stack fargate-dev deleted 
 
Outputs:
  - url: "web-lb-06b2a4a-609955359.us-west-2.elb.amazonaws.com"

Resources:
    - 12 deleted

Duration: 7m2s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained. 
If you want to remove the stack completely, run 'pulumi stack rm dev'.

Stack successfully destroyed
```
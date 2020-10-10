# automation-api-examples

This repo provides full end to end examples and walkthroughs for the Pulumi Automation API: https://pkg.go.dev/github.com/pulumi/pulumi/sdk/v2/go/x/auto?tab=doc

## Content

Take a look at our examples grouped by language.

### Go Examples

Example   | Description |
--------- | --------- |
[Git Repo](go/git_repo_program) | Use Automation API with a Pulumi program from a git repo. In this case a static S3 website from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-go-s3-folder).
[Inline Program](go/inline_program) | Use Automation API with an `inline` Pulumi program. Inline programs are self contained in a single `main.go` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-go-s3-folder).
[Local Program](go/local_program) | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program. We add an Automation API deployment program to our Fargate program that deploys a web service via a Fargate task behind a load balancer.
[Inline/Local Hybrid Program](go/inline_local_hybrid) | This example shows how to refactor your infrastructure to get the best of both worlds, a debuggable `inline` program that can still be driven by the Pulumi CLI for convenience (one off deployments, inspecting the stack, retrieving outputs, etc). In this example we deploy an S3 stacic website. The `automation/main.go` is fully debuggable, including the shared deployment function. The stack can also be managed via the CLI program in `cli/main.go`.
[Multi-Stack Orchestration](go/multi_stack_orchestration) | This example shows how to use Automation API to tame the complexity of multiple stacks with dependent stack outputs. We decompose our S3 static website into two stacks, one that manages the bucket, and another that manages the `index.html` file. Both of these are defined as inline programs, and are deployed and destroyed together via a single `main.go`

### Typescript Examples

Example   | Description |
--------- | --------- |
[Inline Program](typescript/inlineProgram) | Use Automation API with an `inline` Pulumi program. Inline programs are self contained in a single `index.ts` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder).
[Cross-Language Program](typescript/crossLanguage) | This example shows how to use Automation API in `typescript` with an existing traditional CLI-driven Pulumi program written in a __different__ language, in this case `go`. We add an Automation API deployment program to our Fargate program that deploys a web service via a Fargate task behind a load balancer.
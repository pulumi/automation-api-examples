module github.com/evanboyle/automation-api-examples/multi_stack_orchestration

go 1.14

require (
	github.com/pulumi/pulumi-aws/sdk/v3 v3.2.1
	github.com/pulumi/pulumi/sdk/v2 v2.9.2
)

replace github.com/pulumi/pulumi/sdk/v2 => ../../../pulumi/pulumi/sdk

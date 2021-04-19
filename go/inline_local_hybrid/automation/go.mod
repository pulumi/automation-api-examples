module github.com/pulumi/automation-api-examples/go/inline_local_hybrid/automation

go 1.14

replace github.com/pulumi/automation-api-examples/go/inline_local_hybrid/infra => ../infra

require (
	github.com/pulumi/automation-api-examples/go/inline_local_hybrid/infra v0.0.0-00010101000000-000000000000
	github.com/pulumi/pulumi/sdk/v3 v3.0.0
)

module github.com/evanboyle/automation-api-examples/inline_local_hybrid/cli

go 1.14

replace github.com/evanboyle/automation-api-examples/inline_local_hybrid/infra => ../infra

require (
	github.com/evanboyle/automation-api-examples/inline_local_hybrid/infra v0.0.0-00010101000000-000000000000
	github.com/pulumi/pulumi/sdk/v2 v2.10.1
)

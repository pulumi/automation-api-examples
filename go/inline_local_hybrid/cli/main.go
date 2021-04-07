package main

import (
	"github.com/pulumi/automation-api-examples/go/inline_local_hybrid/infra"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// this is our pulumi CLI driver.
// sometimes when iterating on infrastructure it's convenient to use the CLI to poke at your infrastructure.
// with this package layout you can still have an inline program with full debugging capabilities,
// without losing the ability to manually destroy, update, or inspect stack outputs with the CLI.
func main() {
	pulumi.Run(infra.WebsiteDeployFunc)
}

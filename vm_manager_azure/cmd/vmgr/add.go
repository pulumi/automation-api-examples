package main

import (
	"github.com/evanboyle/automation-api-examples/vm_manager_azure/infra/deploy"
	"github.com/spf13/cobra"
)

func NewAddCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "add",
		Short: "add deploys an additional additional vm stack",
		Long: `add deploys an additional additional vm stack. 
		add could be extended to accept custom VM sizes, credentials, regions, etc.`,
		Run: func(cmd *cobra.Command, args []string) {
			// Deploy provisions a new VM running a webserver and prints out the public IP
			deploy.Deploy()
		},
	}
}

package main

import (
	"fmt"
	"time"

	"github.com/evanboyle/automation-api-examples/go/vm_manager_azure/infra/reap"
	"github.com/spf13/cobra"
)

func NewCronCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "cron [expiry]",
		Short:   "cron monitors and cleans up old vmgr deployments",
		Long:    `cron monitors and cleans up old vmgr deployments. It looks for any deployments older than expirationPeriodInMinutes and destroys them.`,
		Example: "`cron 1h` `cron 1m` `cron 5d`",
		Args:    cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			duration, err := time.ParseDuration(args[0])
			if err != nil {
				fmt.Printf("error, failed to parse expiry duration: %v\n", err)
				cmd.Usage()
			}
			for {
				fmt.Printf("Checking for VMs over %s old to reap...\n", args[0])
				reap.Reap(duration)
				fmt.Println("Sleeping for 60 seconds before checking again...")
				fmt.Println()
				time.Sleep(60 * time.Second)
			}
		},
	}
}

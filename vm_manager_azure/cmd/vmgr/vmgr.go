package main

import (
	"github.com/spf13/cobra"
)

func NewVmgrCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "vmgr",
		Short: "vmgr vm management command line",
		Long:  `Pupiter is an interpreter for Pulumi.`,
		Args:  cobra.ArbitraryArgs,
	}

	cmd.AddCommand(NewAddCmd())
	cmd.AddCommand(NewCronCmd())
	return cmd
}
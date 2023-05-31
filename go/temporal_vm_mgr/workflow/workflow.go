package workflow

import (
	"errors"
	"time"

	"go.temporal.io/sdk/workflow"
)

func TemporaryVirtualMachine(ctx workflow.Context, vmName string) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("Workflow TemporaryVirtualMachine started")

	if vmName == "" {
		return errors.New("no VM name received")
	}

	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Hour,
		StartToCloseTimeout:    time.Hour,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	// You could also make it a workflow parameter.
	projectName := "vmgr"

	var network *Network
	err := workflow.ExecuteActivity(ctx, EnsureNetwork, projectName).Get(ctx, &network)
	if err != nil {
		return err
	}

	var stackName string
	err = workflow.ExecuteActivity(ctx, DeployVirtualMachine, projectName, vmName, network).Get(ctx, &stackName)
	if err != nil {
		return err
	}

	logger.Info("VM is ready", "stackName", stackName)

	err = workflow.NewTimer(ctx, time.Minute*5).Get(ctx, nil)
	if err != nil {
		return err
	}

	err = workflow.ExecuteActivity(ctx, TearDownVirtualMachine, projectName, stackName).Get(ctx, nil)
	if err != nil {
		return err
	}

	logger.Info("Temporary Virtual Machine workflow complete")
	return nil
}

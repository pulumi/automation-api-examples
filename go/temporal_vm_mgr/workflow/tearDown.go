package workflow

import (
	"context"

	"github.com/pkg/errors"
	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"
	"github.com/pulumi/pulumi/sdk/v3/go/common/workspace"
	"go.temporal.io/sdk/activity"
)

func TearDownVirtualMachine(ctx context.Context, projectName, stackName string) error {
	logger := activity.GetLogger(ctx)
	project := workspace.Project{
		Name:    tokens.PackageName(projectName),
		Runtime: workspace.NewProjectRuntimeInfo("go", nil),
	}

	logger.Info("Setting up webserver stack...")

	w, err := auto.NewLocalWorkspace(ctx, auto.Project(project))
	if err != nil {
		return errors.Wrap(err, "failed to create workspace")
	}

	err = w.InstallPlugin(ctx, "azure-native", "v1.102.0")
	if err != nil {
		return errors.Wrap(err, "failed to install program plugins")
	}
	err = w.InstallPlugin(ctx, "random", "v4.13.2")
	if err != nil {
		return errors.Wrap(err, "failed to install program plugins")
	}

	user, err := w.WhoAmI(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get authenticated user")
	}

	fqsn := auto.FullyQualifiedStackName(user, projectName, stackName)
	s, err := auto.SelectStack(ctx, fqsn, w)
	if err != nil {
		return errors.Wrap(err, "failed to select stack")
	}

	logger.Info("Destroying stack...", "stackName", stackName)

	_, err = s.Destroy(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to destroy VM stack")
	}

	logger.Info("Deleting stack...", "stackName", stackName)

	err = w.RemoveStack(ctx, stackName)
	if err != nil {
		return errors.Wrap(err, "failed to remove stack")
	}

	return nil
}

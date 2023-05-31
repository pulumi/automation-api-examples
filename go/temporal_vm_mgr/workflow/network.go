package workflow

import (
	"context"

	"github.com/pkg/errors"
	"github.com/pulumi/pulumi-azure-native-sdk/network"
	"github.com/pulumi/pulumi-azure-native-sdk/resources"
	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"
	"github.com/pulumi/pulumi/sdk/v3/go/common/workspace"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"go.temporal.io/sdk/activity"
)

// Network metadata for VM provisioning.
type Network struct {
	ResourceGroupName string
	SubnetID          string
}

// EnsureNetwork creates or finds an existing virtual network where VMs should be placed.
func EnsureNetwork(ctx context.Context, projectName string) (*Network, error) {
	logger := activity.GetLogger(ctx)
	project := workspace.Project{
		Name:    tokens.PackageName(projectName),
		Runtime: workspace.NewProjectRuntimeInfo("go", nil),
	}
	w, err := auto.NewLocalWorkspace(ctx, auto.Program(DeployNetworkFunc), auto.Project(project))
	if err != nil {
		return nil, errors.Wrap(err, "failed to create workspace")
	}

	err = w.InstallPlugin(ctx, "azure-native", "v1.102.0")
	if err != nil {
		return nil, errors.Wrap(err, "failed to install program plugins")
	}

	user, err := w.WhoAmI(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get authenticated user")
	}

	// create the special networking stack
	fqsn := auto.FullyQualifiedStackName(user, projectName, "networking")
	s, err := auto.UpsertStack(ctx, fqsn, w)
	if err != nil {
		s, err = auto.SelectStack(ctx, fqsn, w)
		if err != nil {
			return nil, errors.Wrap(err, "failed to create new or select existing network stack")
		}
	}

	outs, err := s.Outputs(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get networking stack outputs")
	}
	resourceGroupName, rgOk := outs["resourceGroupName"].Value.(string)
	subnetID, sidOk := outs["subnetID"].Value.(string)
	if rgOk && sidOk && resourceGroupName != "" && subnetID != "" {
		logger.Info("Found an existing networking stack", "resourceGroupName", resourceGroupName)
		return &Network{resourceGroupName, subnetID}, nil
	}

	err = s.SetConfig(ctx, "azure-native:location", auto.ConfigValue{Value: "westus"})
	if err != nil {
		return nil, errors.Wrap(err, "failed to set config")
	}

	res, err := s.Up(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "failed to deploy network stack")
	}

	logger.Info("Created a new networking stack", "resourceGroupName", resourceGroupName)
	return &Network{
		res.Outputs["resourceGroupName"].Value.(string),
		res.Outputs["subnetID"].Value.(string)}, nil
}

// DeployNetworkFunc is a pulumi program that sets up a resource group and a virtual network.
func DeployNetworkFunc(ctx *pulumi.Context) error {
	rg, err := resources.NewResourceGroup(ctx, "server-rg", nil)
	if err != nil {
		return err
	}

	virtualNetwork, err := network.NewVirtualNetwork(ctx, "server-network", &network.VirtualNetworkArgs{
		ResourceGroupName: rg.Name,
		AddressSpace: network.AddressSpaceArgs{
			AddressPrefixes: pulumi.ToStringArray([]string{
				"10.0.0.0/16",
			}),
		},
		Subnets: network.SubnetTypeArray{
			network.SubnetTypeArgs{
				Name:          pulumi.String("default"),
				AddressPrefix: pulumi.String("10.0.1.0/24"),
			},
		},
	})
	if err != nil {
		return err
	}

	subnetID := virtualNetwork.Subnets.Index(pulumi.Int(0)).Id().ApplyT(func(val *string) (string, error) {
		if val == nil {
			return "", nil
		}
		return *val, nil
	}).(pulumi.StringOutput)
	ctx.Export("subnetID", subnetID)
	ctx.Export("resourceGroupName", rg.Name)
	return nil
}

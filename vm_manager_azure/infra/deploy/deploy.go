package deploy

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"time"

	"github.com/evanboyle/automation-api-examples/vm_manager_azure/infra/webserver"
	"github.com/pulumi/pulumi-azure/sdk/v3/go/azure/core"
	"github.com/pulumi/pulumi-azure/sdk/v3/go/azure/network"
	"github.com/pulumi/pulumi-random/sdk/v2/go/random"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto/optup"
)

func Deploy() {
	ctx := context.Background()
	projectName := "vmgr"
	stackName := fmt.Sprintf("vmgr%d", rangeIn(10000000, 99999999))
	// create a new stack for our VM with an Inline program.
	// the program is nil for now, but we'll set it later after retrieving some dependent outputs.
	s, err := auto.NewStackInlineSource(ctx, stackName, projectName, nil /* Program */)

	w := s.Workspace()

	err = w.InstallPlugin(ctx, "azure", "v3.19.0")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}
	err = w.InstallPlugin(ctx, "random", "v2.3.1")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}

	err = s.SetConfig(ctx, "azure:location", auto.ConfigValue{Value: "westus"})
	if err != nil {
		fmt.Printf("Failed to set config: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("ensuring network is configured...")
	subnetID, rgName, err := EnsureNetwork(ctx, projectName)

	// set out program for the deployment with the resulting network info
	w.SetProgram(GetDeployVMFunc(subnetID, rgName))

	fmt.Println("deploying vm webserver...")

	// wire up our update to stream progress to stdout
	stdoutStreamer := optup.ProgressStreams(os.Stdout)

	res, err := s.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to deploy vm stack: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("deployed server running at public IP %s\n", res.Outputs["ip"].Value.(string))
}

func rangeIn(low, hi int) int {
	rand.Seed(time.Now().UnixNano())
	return low + rand.Intn(hi-low)
}

func GetDeployVMFunc(subnetID, rgName string) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {
		username := "pulumi"
		password, err := random.NewRandomPassword(ctx, "password", &random.RandomPasswordArgs{
			Length:  pulumi.Int(16),
			Special: pulumi.Bool(false),
		})
		if err != nil {
			return err
		}

		server, err := webserver.NewWebserver(ctx, "vm-webserver", &webserver.WebserverArgs{
			Username: pulumi.String(username),
			Password: password.Result,
			BootScript: pulumi.String(fmt.Sprintf(`#!/bin/bash
	echo "Hello, from VMGR!" > index.html
	nohup python -m SimpleHTTPServer 80 &`)),
			ResourceGroupName: pulumi.String(rgName),
			SubnetID:          pulumi.String(subnetID),
		})
		if err != nil {
			return err
		}

		ctx.Export("ip", server.GetIPAddress(ctx))
		return nil
	}
}

// EnsureNetwork deploys the network stack if none exists, or simply returns the associated
// subnetID and resourceGroupName
func EnsureNetwork(ctx context.Context, projectName string) (string, string, error) {
	stackName := "networking"
	// create or select a stack with the inline networking program
	s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, DeployNetworkFunc)
	if err != nil {
		fmt.Printf("failed to create or select stack: %v\n", err)
	}

	outs, err := s.Outputs(ctx)
	if err != nil {
		fmt.Printf("failed to get networking stack outputs: %v\n", err)
		os.Exit(1)
	}
	rgName, rgOk := outs["rgName"].Value.(string)
	subnetID, sidOk := outs["subnetID"].Value.(string)
	if rgOk && sidOk && rgName != "" && subnetID != "" {
		return subnetID, rgName, nil
	}

	err = s.SetConfig(ctx, "azure:location", auto.ConfigValue{Value: "westus"})
	if err != nil {
		fmt.Printf("Failed to set config: %v\n", err)
		os.Exit(1)
	}

	// wire up our update to stream progress to stdout
	stdoutStreamer := optup.ProgressStreams(os.Stdout)

	res, err := s.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to deploy network stack: %v\n", err)
		os.Exit(1)
	}
	return res.Outputs["subnetID"].Value.(string), res.Outputs["rgName"].Value.(string), nil
}

// DeployNetworkFunc is a pulumi program that sets up an RG, and virtual network.
func DeployNetworkFunc(ctx *pulumi.Context) error {
	rg, err := core.NewResourceGroup(ctx, "server-rg", nil)
	if err != nil {
		return err
	}

	network, err := network.NewVirtualNetwork(ctx, "server-network", &network.VirtualNetworkArgs{
		ResourceGroupName: rg.Name,
		AddressSpaces:     pulumi.StringArray{pulumi.String("10.0.0.0/16")},
		Subnets: network.VirtualNetworkSubnetArray{
			network.VirtualNetworkSubnetArgs{
				Name:          pulumi.String("default"),
				AddressPrefix: pulumi.String("10.0.1.0/24"),
			},
		},
	})

	subnetID := network.Subnets.Index(pulumi.Int(0)).Id().ApplyT(func(val *string) (string, error) {
		if val == nil {
			return "", nil
		}
		return *val, nil
	}).(pulumi.StringOutput)
	ctx.Export("subnetID", subnetID)
	ctx.Export("rgName", rg.Name)
	return nil
}

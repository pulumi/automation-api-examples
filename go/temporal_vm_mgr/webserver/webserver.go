package webserver

import (
	"fmt"
	"math/rand"
	"time"

	b64 "encoding/base64"

	"github.com/pulumi/pulumi-azure-native-sdk/compute"
	"github.com/pulumi/pulumi-azure-native-sdk/network"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// Webserver is a reusable web server component that creates and exports a NIC, public IP, and VM.
type Webserver struct {
	pulumi.ResourceState

	PublicIP          *network.PublicIPAddress
	NetworkInterface  *network.NetworkInterface
	VM                *compute.VirtualMachine
	ResourceGroupName pulumi.StringInput
}

type WebserverArgs struct {
	// A required username for the VM login.
	Username pulumi.StringInput

	// A required encrypted password for the VM password.
	Password pulumi.StringInput

	// An optional boot script that the VM will use.
	BootScript string

	// An optional VM size; if unspecified, Standard_A0 (micro) will be used.
	VMSize pulumi.StringInput

	// A required Resource Group in which to create the VM
	ResourceGroupName pulumi.StringInput

	// A required Subnet in which to deploy the VM
	SubnetID pulumi.StringInput
}

// NewWebserver allocates a new web server VM, NIC, and public IP address.
func NewWebserver(ctx *pulumi.Context, name string, args *WebserverArgs, opts ...pulumi.ResourceOption) (*Webserver, error) {
	webserver := &Webserver{
		ResourceGroupName: args.ResourceGroupName,
	}
	err := ctx.RegisterComponentResource("ws-ts-azure-comp:webserver:WebServer", name, webserver, opts...)
	if err != nil {
		return nil, err
	}

	webserver.PublicIP, err = network.NewPublicIPAddress(ctx, name+"-ip", &network.PublicIPAddressArgs{
		ResourceGroupName:        args.ResourceGroupName,
		PublicIPAllocationMethod: pulumi.String("Dynamic"),
	}, pulumi.Parent(webserver))
	if err != nil {
		return nil, err
	}

	webserver.NetworkInterface, err = network.NewNetworkInterface(ctx, name+"-nic", &network.NetworkInterfaceArgs{
		ResourceGroupName:    args.ResourceGroupName,
		NetworkInterfaceName: pulumi.String(name + "-nic"),
		IpConfigurations: network.NetworkInterfaceIPConfigurationArray{
			&network.NetworkInterfaceIPConfigurationArgs{
				Name: pulumi.String("ipconfig"),
				Subnet: &network.SubnetTypeArgs{
					Id: args.SubnetID.ToStringOutput(),
				},
				PublicIPAddress: &network.PublicIPAddressTypeArgs{
					Id: webserver.PublicIP.ID(),
				},
			},
		},
	}, pulumi.Parent(webserver))
	if err != nil {
		return nil, err
	}

	vmSize := args.VMSize
	if vmSize == nil {
		vmSize = pulumi.String("Standard_D2s_v3")
	}

	// Now create the VM, using the resource group and NIC allocated above.
	webserver.VM, err = compute.NewVirtualMachine(ctx, name+"-vm", &compute.VirtualMachineArgs{
		ResourceGroupName: args.ResourceGroupName,
		NetworkProfile: &compute.NetworkProfileArgs{
			NetworkInterfaces: compute.NetworkInterfaceReferenceArray{
				&compute.NetworkInterfaceReferenceArgs{
					Id:      webserver.NetworkInterface.ID(),
					Primary: pulumi.Bool(true),
				},
			},
		},
		HardwareProfile: &compute.HardwareProfileArgs{
			VmSize: pulumi.StringInput(vmSize),
		},
		OsProfile: &compute.OSProfileArgs{
			ComputerName:  pulumi.String("hostname"),
			AdminUsername: args.Username,
			AdminPassword: args.Password,
			CustomData:    pulumi.String((b64.StdEncoding.EncodeToString([]byte(args.BootScript)))), //args.BootScript.ToStringOutput(),
			LinuxConfiguration: &compute.LinuxConfigurationArgs{
				DisablePasswordAuthentication: pulumi.Bool(false),
			},
		},
		StorageProfile: &compute.StorageProfileArgs{
			OsDisk: &compute.OSDiskArgs{
				CreateOption: pulumi.String("FromImage"),
				Name:         pulumi.String(fmt.Sprintf("%d", rangeIn(10000000, 99999999))),
				DeleteOption: pulumi.String("Delete"),
			},
			ImageReference: &compute.ImageReferenceArgs{
				Publisher: pulumi.String("canonical"),
				Offer:     pulumi.String("0001-com-ubuntu-server-jammy"),
				Sku:       pulumi.String("22_04-lts-gen2"),
				Version:   pulumi.String("latest"),
			},
		},
	}, pulumi.Parent(webserver), pulumi.DependsOn([]pulumi.Resource{webserver.NetworkInterface, webserver.PublicIP}))
	if err != nil {
		return nil, err
	}

	return webserver, nil
}

func (ws *Webserver) GetIPAddress(ctx *pulumi.Context) pulumi.StringOutput {
	// The public IP address is not allocated until the VM is running, so wait for that resource to create, and then
	// lookup the IP address again to report its public IP.
	ready := pulumi.All(ws.VM.ID(), ws.PublicIP.Name, ws.ResourceGroupName)
	return ready.ApplyT(func(args []interface{}) (string, error) {
		name := args[1].(string)
		resourceGroupName := args[2].(string)
		ip, err := network.LookupPublicIPAddress(ctx, &network.LookupPublicIPAddressArgs{
			PublicIpAddressName: name,
			ResourceGroupName:   resourceGroupName,
		})
		if err != nil {
			return "", err
		}
		return *ip.IpAddress, nil
	}).(pulumi.StringOutput)
}

func rangeIn(low, hi int) int {
	rand.Seed(time.Now().UnixNano())
	return low + rand.Intn(hi-low)
}

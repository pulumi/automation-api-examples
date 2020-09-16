# Azure VM Manager (VMGR)

In this example we use Automation API to build a high-level operational CLI that is an abstraction over Pulumi. The goal is to build a platform that allows uses to provision temporary VMs. Our users typically forget about these VMs, so we want an automated way to clean them up after a specified period of time. To accomplish this we build a custom CLI called `vmgr`.

`vmgr` is a tool designed to provision Azure VMs with a temporary lifetime. The tool consists of two commands:

- `vmgr add`: creates a new VM webserver with a public IP. these webservers share a resource group and virtual network that is referenced from a shared stack.
- `vmgr cron <expiration>`: scans all VM stacks on a minutely cadence, looking for stacks that are older than the specified expiration duration. Given that public IP dissociation can be a little flakey, this command will continue to retry deletion even if it sees failures. Typically it will succeed in deleting the VM and public IP on the second try. Example: `vmgr cron 5m` to delete vms older than 5 minutes, or `vmgr cron 5d` to delete VMs older than five days.

## Installation

```shell
# install the binary
$ go install github.com/evanboyle/automation-api-examples/vm_manager_azure/cmd/vmgr
```

Note that this requires Pulumi CLI >= v2.10.1 and an authenticated Azure CLI.

## Adding VMs
```shell
$ vmgr add
setting up webserver stack...
ensuring network is configured...
found existing network stack
deploying vm webserver...
deployed server running at public IP 40.78.90.53
# imagine that a few VMs are added in the background ...
```

## Running the Cron VM Reaper

```shell
# run vmgr cron to look for VMs older than five minutes
$ vmgr cron 5m
Checking for VMs over 5m old to reap...
Found expired stack EvanBoyle/vmgr/vmgr46085389 last deployed at 2020-09-04T23:15:14.000Z
Found 1 stacks to clean up
destroying stack EvanBoyle/vmgr/vmgr46085389
removing stack EvanBoyle/vmgr/vmgr46085389 and all associated config and history
stack EvanBoyle/vmgr/vmgr46085389 successfully reaped 
destroyed 1 stack(s)
finished reaping stacks
Sleeping for 60 seconds before checking again...

Checking for VMs over 5m old to reap...
Found expired stack EvanBoyle/vmgr/vmgr65433804 last deployed at 2020-09-04T23:19:03.000Z
Found 1 stacks to clean up
destroying stack EvanBoyle/vmgr/vmgr65433804
removing stack EvanBoyle/vmgr/vmgr65433804 and all associated config and history
stack EvanBoyle/vmgr/vmgr65433804 successfully reaped 
destroyed 1 stack(s)
finished reaping stacks
Sleeping for 60 seconds before checking again...

Checking for VMs over 5m old to reap...
Found 0 stacks to clean up
destroyed 0 stack(s)
finished reaping stacks
Sleeping for 60 seconds before checking again...

Checking for VMs over 5m old to reap...
Found 0 stacks to clean up
destroyed 0 stack(s)
finished reaping stacks
Sleeping for 60 seconds before checking again...

Checking for VMs over 5m old to reap...
Found 0 stacks to clean up
destroyed 1 stack(s)
finished reaping stacks
Sleeping for 60 seconds before checking again...

...
```

### Retrying failures

Sometimes `vmgr` encounters errors trying to destroy the stacks; Azure IPs can require retries when deleting. `vmgr` will retry those failures on the next pass after sleeping for 60 seconds.

On the first try it fails to delete stack `vmgr65433804`: 
```shell
$ vmgr cron 5m
Checking for VMs over 5m old to reap...
Found expired stack EvanBoyle/vmgr/vmgr40826692 last deployed at 2020-09-04T23:10:59.000Z
Found expired stack EvanBoyle/vmgr/vmgr65433804 last deployed at 2020-09-04T23:08:48.000Z
Found 2 stacks to clean up
destroying stack EvanBoyle/vmgr/vmgr40826692
removing stack EvanBoyle/vmgr/vmgr40826692 and all associated config and history
stack EvanBoyle/vmgr/vmgr40826692 successfully reaped 
destroying stack EvanBoyle/vmgr/vmgr65433804
failed to clean up stack EvanBoyle/vmgr/vmgr65433804: code: 255
, stdout: Destroying (vmgr65433804)

View Live: https://app.pulumi.com/EvanBoyle/vmgr/vmgr65433804/updates/2


 -  azure:compute:VirtualMachine vm-webserver-vm deleting 
@ Destroying..........
 -  azure:compute:VirtualMachine vm-webserver-vm deleted 
 -  azure:network:PublicIp vm-webserver-ip deleting 
 -  azure:network:NetworkInterface vm-webserver-nic deleting 
 -  azure:network:PublicIp vm-webserver-ip deleting error: deleting urn:pulumi:vmgr65433804::vmgr::ws-ts-azure-comp:webserver:WebServer$azure:network/publicIp:PublicIp::vm-webserver-ip: Error deleting Public IP "vm-webserver-ipcbd245ea" (Resource Group "server-rg52e815a9"): network.PublicIPAddressesClient#Delete: Failure sending request: StatusCode=400 -- Original Error: Code="PublicIPAddressCannotBeDeleted" Message="Public IP address /subscriptions/0282681f-7a9e-424b-80b2-96babd57a8a1/resourceGroups/server-rg52e815a9/providers/Microsoft.Network/publicIPAddresses/vm-webserver-ipcbd245ea can not be deleted since it is still allocated to resource /subscriptions/0282681f-7a9e-424b-80b2-96babd57a8a1/resourceGroups/server-rg52e815a9/providers/Microsoft.Network/networkInterfaces/vm-webserver-nic80520646/ipConfigurations/webserveripcfg. In order to delete the public IP, disassociate/detach the Public IP address from the resource.  To learn how to do this, see aka.ms/deletepublicip." Details=[]
 -  azure:network:PublicIp vm-webserver-ip **deleting failed** error: deleting urn:pulumi:vmgr65433804::vmgr::ws-ts-azure-comp:webserver:WebServer$azure:network/publicIp:PublicIp::vm-webserver-ip: Error deleting Public IP "vm-webserver-ipcbd245ea" (Resource Group "server-rg52e815a9"): network.PublicIPAddressesClient#Delete: Failure sending request: StatusCode=400 -- Original Error: Code="PublicIPAddressCannotBeDeleted" Message="Public IP address /subscriptions/0282681f-7a9e-424b-80b2-96babd57a8a1/resourceGroups/server-rg52e815a9/providers/Microsoft.Network/publicIPAddresses/vm-webserver-ipcbd245ea can not be deleted since it is still allocated to resource /subscriptions/0282681f-7a9e-424b-80b2-96babd57a8a1/resourceGroups/server-rg52e815a9/providers/Microsoft.Network/networkInterfaces/vm-webserver-nic80520646/ipConfigurations/webserveripcfg. In order to delete the public IP, disassociate/detach the Public IP address from the resource.  To learn how to do this, see aka.ms/deletepublicip." Details=[]
 -  azure:network:NetworkInterface vm-webserver-nic deleted 
    pulumi:pulumi:Stack vmgr-vmgr65433804  error: update failed
    pulumi:pulumi:Stack vmgr-vmgr65433804 **failed** 1 error
 
Diagnostics:
  pulumi:pulumi:Stack (vmgr-vmgr65433804):
    error: update failed
 
  azure:network:PublicIp (vm-webserver-ip):
    error: deleting urn:pulumi:vmgr65433804::vmgr::ws-ts-azure-comp:webserver:WebServer$azure:network/publicIp:PublicIp::vm-webserver-ip: Error deleting Public IP "vm-webserver-ipcbd245ea" (Resource Group "server-rg52e815a9"): network.PublicIPAddressesClient#Delete: Failure sending request: StatusCode=400 -- Original Error: Code="PublicIPAddressCannotBeDeleted" Message="Public IP address /subscriptions/0282681f-7a9e-424b-80b2-96babd57a8a1/resourceGroups/server-rg52e815a9/providers/Microsoft.Network/publicIPAddresses/vm-webserver-ipcbd245ea can not be deleted since it is still allocated to resource /subscriptions/0282681f-7a9e-424b-80b2-96babd57a8a1/resourceGroups/server-rg52e815a9/providers/Microsoft.Network/networkInterfaces/vm-webserver-nic80520646/ipConfigurations/webserveripcfg. In order to delete the public IP, disassociate/detach the Public IP address from the resource.  To learn how to do this, see aka.ms/deletepublicip." Details=[]
 
Resources:
    - 2 deleted

Duration: 2m39s


, stderr: 
: failed to destroy stack: exit status 255
will try again in 60 seconds
destroyed 1 stack(s)
failed to destroy 1 stacks, will retry next iteration
finished reaping stack(s)
Sleeping for 60 seconds before checking again...
```

But no worries, it succeeds on the second round without intervention.

```shell
Checking for VMs over 5m old to reap...
Found expired stack EvanBoyle/vmgr/vmgr65433804 last deployed at 2020-09-04T23:19:03.000Z
Found 1 stacks to clean up
destroying stack EvanBoyle/vmgr/vmgr65433804
removing stack EvanBoyle/vmgr/vmgr65433804 and all associated config and history
stack EvanBoyle/vmgr/vmgr65433804 successfully reaped 
destroyed 1 stack(s)
finished reaping stacks
Sleeping for 60 seconds before checking again...

```

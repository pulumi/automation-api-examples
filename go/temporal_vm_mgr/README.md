# Azure VM Manager (VMGR)

In this example we use Temporal workflows and Pulumi Automation API to provision temporary VMs that are automatically destroyed after a fixed period.

(Adapted from https://github.com/mikhailshilkov/pulumi-temporal-workflow)

## How to Run the Example

### 1. Install a local Temporal server

Follow [Install Temporal](https://docs.temporal.io/kb/all-the-ways-to-run-a-cluster) to run a local Temporal server.

### 2. Run a worker

Execute the following command from this example's root folder to start a new workflow host process:

```
$ go run *.go
2020/09/06 11:44:03 INFO  No logger configured for temporal client. Created default one.
2020/09/06 11:44:03 INFO  Started Worker Namespace default TaskQueue pulumi WorkerID 9084@hostname.lan@
```

Leave the worker running until the end of the walkthrough.

### 3. Execute a workflow

```
$ docker run --network=host --rm temporalio/tctl:latest wf start --tq pulumi --wt TemporaryVirtualMachine --et 3600 -w myworkflow1 -i '"myvm1"'

Started Workflow Id: myworkflow1, run Id: d32ca0ef-4b91-4d1d-a31a-d5c434d7ee27
```

The workflow would run and create a virtual machine called `myvm1`.

### 4. Clean Up

After you are done experimenting, depstroy a resource group with a name starting with `server-rg` (e.g. `server-rg487452c`):

```
$ az group list -o table

Name                   Location   Status
---------------------  ---------  ---------
server-rge487452c      westus     Succeeded

$ az group delete -n server-rge487452c
```

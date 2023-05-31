package main

import (
	"log"

	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"

	"github.com/pierskarsenbarg/pulumi-temporal/workflow"
)

func main() {
	// The client is a heavyweight object that should be created once
	clientOptions := client.Options{HostPort: "localhost:7233"}
	serviceClient, err := client.NewClient(clientOptions)

	if err != nil {
		log.Fatalf("Unable to create client.  Error: %v", err)
	}

	w := worker.New(serviceClient, "pulumi", worker.Options{})

	w.RegisterWorkflow(workflow.TemporaryVirtualMachine)
	w.RegisterActivity(workflow.EnsureNetwork)
	w.RegisterActivity(workflow.DeployVirtualMachine)
	w.RegisterActivity(workflow.TearDownVirtualMachine)

	err = w.Run(worker.InterruptCh())
	if err != nil {
		log.Fatalf("Unable to start worker.  Error: %v", err)
	}
}

package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/pulumi/pulumi/sdk/v2/go/x/auto"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto/optup"
)

func main() {
	// to destroy our program, we can run `go run main.go destroy`
	destroy := false
	argsWithoutProg := os.Args[1:]
	if len(argsWithoutProg) > 0 {
		if argsWithoutProg[0] == "destroy" {
			destroy = true
		}
	}
	ctx := context.Background()

	// we use a simple stack name here, but recommend using auto.FullyQualifiedStackName for maximum specificity.
	stackName := "dev"
	// stackName := auto.FullyQualifiedStackName("myOrgOrUser", projectName, stackName)

	// in this example our automation driver is being added to an exising local Pulumi project.
	// we'll create/select a stack from the working directory that contains our "fargate" CLI program.
	// this program creates an ecs cluster, an erc registry, builds and uploads the docker image in
	// ../app, creates a fargate task, and exposes it behind a load balancer.
	workDir := filepath.Join("..", "fargate")

	// create or select a stack from a local workspace with CLI program, using the ../fargate workDir.
	// the Pulumi program, and any project or stack settings will be used by our stack.
	s, err := auto.UpsertStackLocalSource(ctx, stackName, workDir)
	if err != nil {
		fmt.Printf("Failed to create or select stack: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Created/Selected stack %q\n", stackName)

	// set stack configuration specifying the AWS region to deploy
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

	fmt.Println("Successfully set config")
	fmt.Println("Starting refresh")

	_, err = s.Refresh(ctx)
	if err != nil {
		fmt.Printf("Failed to refresh stack: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Refresh succeeded!")

	if destroy {
		fmt.Println("Starting stack destroy")
		// wire up our destroy to stream progress to stdout
		stdoutStreamer := optdestroy.ProgressStreams(os.Stdout)
		// destroy our stack and exit early
		_, err := s.Destroy(ctx, stdoutStreamer)
		if err != nil {
			fmt.Printf("Failed to destroy stack: %v", err)
		}
		fmt.Println("Stack successfully destroyed")
		os.Exit(0)
	}

	fmt.Println("Starting update")

	// wire up our update to stream progress to stdout
	stdoutStreamer := optup.ProgressStreams(os.Stdout)

	// run the update to deploy our fargate web service
	res, err := s.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}

	fmt.Println("Update succeeded!")

	// get the URL from the stack outputs
	url, ok := res.Outputs["url"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output URL")
		os.Exit(1)
	}

	fmt.Printf("URL: %s\n", url)
}

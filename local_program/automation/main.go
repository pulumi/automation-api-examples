package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/pulumi/pulumi/sdk/v2/go/x/auto"
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

	// in this example our automation driver is being added to an exising local Pulumi project.
	// we'll create a workspace from the working directory that contains our "fargate" CLI program.
	// this program creates an ecs cluster, an erc registry, builds and uploads the docker image in
	// ../app, creates a fargate task, and exposes it behind a load balancer.
	workDir := filepath.Join("..", "fargate")

	// create an local workspace with CLI program, using the ../fargate workDir.
	// the Pulumi program, and any project or stack settings will be used by our workspace.
	w, err := auto.NewLocalWorkspace(ctx, auto.WorkDir(workDir))
	if err != nil {
		fmt.Printf("Failed to create workspace: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Successfully setup workspace")

	// lookup the authenticated user to use in stack creation
	user, err := w.WhoAmI(ctx)
	if err != nil {
		fmt.Printf("Failed to get authenticated user: %v\n", err)
		os.Exit(1)
	}

	// read in the existing project settings detected from the workdir (../fargate)
	// and grab the project name for our FQSN
	project, err := w.ProjectSettings(ctx)
	if err != nil {
		fmt.Printf("failed to read project settings from workspace: %s\n", err)
	}

	projectName := project.Name.String()

	stackName := "dev"
	// create a fully qualified stack name in the form "org/project/stack".
	// this full name is required when creating and selecting stack with automation API
	fqsn := auto.FullyQualifiedStackName(user, projectName, stackName)

	// try to create a new stack from our local workspace
	s, err := auto.NewStack(ctx, fqsn, w)
	if err != nil {
		// we'll encounter an error if the stack already exists. try to select it before giving up
		s, err = auto.SelectStack(ctx, fqsn, w)
		if err != nil {
			fmt.Printf("Failed to create or select stack: %v\n", err)
			os.Exit(1)
		}
	}

	fmt.Printf("Created/Select stack %q\n", fqsn)

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
		// destroy our stack and exit early
		_, err := s.Destroy(ctx)
		if err != nil {
			fmt.Printf("Failed to destroy stack: %v", err)
		}
		fmt.Println("Stack successfully destroyed")
		os.Exit(0)
	}

	fmt.Println("Starting update")

	// run the update to deploy our fargate web service
	res, err := s.Up(ctx)
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

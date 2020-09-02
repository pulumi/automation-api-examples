package main

import (
	"context"
	"fmt"
	"os"

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

	// create a local workspace seeded with a Pulumi program from a git remote
	projectName := "aws-go-s3-folder"
	repo := auto.GitRepo{
		URL:         "https://github.com/pulumi/examples.git",
		ProjectPath: projectName,
	}
	w, err := auto.NewLocalWorkspace(ctx, auto.Repo(repo))
	if err != nil {
		fmt.Printf("Failed to create workspace from git repo: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Successfully cloned project and setup workspace")

	// lookup the authenticated user to use in stack creation
	user, err := w.WhoAmI(ctx)
	if err != nil {
		fmt.Printf("Failed to get authenticated user: %v\n", err)
		os.Exit(1)
	}
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
		err := destroyStack(s)
		if err != nil {
			fmt.Printf("Failed to destroy stack: %v", err)
		}
		fmt.Println("Stack successfully destroyed")
		os.Exit(0)
	}

	fmt.Println("Starting update")

	// run the update to deploy our s3 website
	res, err := s.Up(ctx)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}

	fmt.Println("Update succeeded!")

	// get the URL from the stack outputs
	url, ok := res.Outputs["websiteUrl"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output URL")
		os.Exit(1)
	}

	fmt.Printf("URL: %s\n", url)
}

func destroyStack(stack auto.Stack) error {
	return nil
}

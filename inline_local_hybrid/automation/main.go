package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/evanboyle/automation-api-examples/inline_local_hybrid/infra"
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

	// we're going to use the same working directory as our CLI driver.
	// doing this allows us to share the Project and Stack Settings (Pulumi.yaml and any Pulumi.<stack>.yaml files)
	workDir := filepath.Join("..", "cli")

	// create an local workspace with our inline program, using the ../cli workDir
	// here our inline program comes from a shared package.
	// this allows us to have both an automation program, and a manual CLI program for development sharing code.
	w, err := auto.NewLocalWorkspace(ctx, auto.Program(infra.WebsiteDeployFunc), auto.WorkDir(workDir))
	if err != nil {
		fmt.Printf("Failed to create workspace: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Successfully setup workspace")
	fmt.Println("Installing the AWS plugin")

	// for inline source programs, we must manage plugins ourselves
	err = w.InstallPlugin(ctx, "aws", "v3.2.1")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Successfully installed AWS plugin")

	// lookup the authenticated user to use in stack creation
	user, err := w.WhoAmI(ctx)
	if err != nil {
		fmt.Printf("Failed to get authenticated user: %v\n", err)
		os.Exit(1)
	}

	// read in the existing project settings detected from the workdir (../cli)
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

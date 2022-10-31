package main

import (
	"context"
	"fmt"
	"os"

	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optremotedestroy"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optremoteup"
)

func main() {
	ctx := context.Background()

	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Println("usage: go run main.go <org> [destroy]")
		os.Exit(1)
	}

	org := args[0]
	project := "aws-ts-s3-folder"
	stackName := auto.FullyQualifiedStackName(org, project, "dev")
	awsRegion := "us-west-2"

	repo := auto.GitRepo{
		URL:         "https://github.com/pulumi/examples.git",
		Branch:      "refs/heads/master",
		ProjectPath: project,
	}

	env := map[string]auto.EnvVarValue{
		"AWS_REGION":            {Value: awsRegion},
		"AWS_ACCESS_KEY_ID":     {Value: os.Getenv("AWS_ACCESS_KEY_ID")},
		"AWS_SECRET_ACCESS_KEY": {Value: os.Getenv("AWS_SECRET_ACCESS_KEY"), Secret: true},
		"AWS_SESSION_TOKEN":     {Value: os.Getenv("AWS_SESSION_TOKEN"), Secret: true},
	}

	// Create or select an existing stack matching the given name.
	s, err := auto.UpsertRemoteStackGitSource(ctx, stackName, repo, auto.RemoteEnvVars(env))
	if err != nil {
		fmt.Printf("Failed to create or select stack: %v\n", err)
		os.Exit(1)
	}

	destroy := len(args) > 1 && args[1] == "destroy"
	if destroy {
		// Wire up our destroy to stream progress to stdout.
		stdoutStreamer := optremotedestroy.ProgressStreams(os.Stdout)
		// Destroy our stack and exit early.
		_, err := s.Destroy(ctx, stdoutStreamer)
		if err != nil {
			fmt.Printf("Failed to destroy stack: %v", err)
		}
		fmt.Println("Stack successfully destroyed")
		os.Exit(0)
	}

	// Wire up our update to stream progress to stdout.
	stdoutStreamer := optremoteup.ProgressStreams(os.Stdout)

	// Run the update to deploy our s3 website.
	res, err := s.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}

	fmt.Println("Update succeeded!")

	// Get the URL from the stack outputs
	url, ok := res.Outputs["websiteUrl"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output URL")
		os.Exit(1)
	}

	fmt.Printf("URL: %s\n", url)
}

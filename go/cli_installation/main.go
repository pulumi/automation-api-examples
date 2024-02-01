package main

import (
	"context"
	"fmt"
	"os"

	"github.com/blang/semver"
	random "github.com/pulumi/pulumi-random/sdk/v4/go/random"

	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
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

	deployFunc := func(ctx *pulumi.Context) error {
		pet, err := random.NewRandomPet(ctx, "Fluffy", &random.RandomPetArgs{})
		if err != nil {
			return err
		}
		ctx.Export("pet.id", pet.ID())
		return nil
	}

	ctx := context.Background()

	projectName := "autoInstall"
	stackName := "dev"

	tempDir, err := os.MkdirTemp("", "cli_installation_exmple")
	if err != nil {
		fmt.Printf("Failed to create temp dir: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Installing pulumi into %s\n", tempDir)

	// Install pulumi v3.104.1 into $tmpDir
	pulumiCommand, err := auto.InstallPulumiCommand(ctx, &auto.PulumiCommandOptions{
		// Version defaults to the version matching the current pulumi/sdk.
		Version: semver.MustParse("3.104.1"),
		// Root defaults to `$HOME/.pulumi/versions/$VERSION`.
		Root: tempDir,
	})
	if err != nil {
		fmt.Printf("Failed to install pulumi command: %v\n", err)
		os.Exit(1)
	}

	// You can also retrieve an already installed version using NewPulumiCommand.
	// This will return an error if no pulumi binary can be found or a binary
	// is found but the version is not compatible with the requested version.
	//
	//   pulumiCommand, err := auto.NewPulumiCommand(&auto.PulumiCommandOptions{
	// 	   Version: semver.MustParse("3.104.1"),
	// 	   Root:    tempDir,
	//   })

	// Pass the PulumiCommand instance as an option for the underlying workspace.
	s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, deployFunc, auto.Pulumi(pulumiCommand))
	if err != nil {
		fmt.Printf("Failed to set up a workspace: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Created/Selected stack %q\n", stackName)

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

	// run the update to deploy our s3 website
	res, err := s.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}

	fmt.Println("Update succeeded!")

	// get the URL from the stack outputs
	petID, ok := res.Outputs["pet.id"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output pet.id")
		os.Exit(1)
	}

	fmt.Printf("pet: %s\n", petID)
}

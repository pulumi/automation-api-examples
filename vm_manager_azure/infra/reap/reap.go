package reap

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/pulumi/pulumi/sdk/v2/go/common/tokens"
	"github.com/pulumi/pulumi/sdk/v2/go/common/workspace"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto/optdestroy"
)

// Reap cleans up all vmgr stacks that are older than the specified threshold
func Reap(threshold time.Duration) {
	ctx := context.Background()
	projectName := "vmgr"
	project := workspace.Project{
		Name:    tokens.PackageName(projectName),
		Runtime: workspace.NewProjectRuntimeInfo("go", nil),
	}

	// destroy doesn't run the program, so we have a placeholder here
	nilProgram := auto.Program(func(pCtx *pulumi.Context) error { return nil })

	w, err := auto.NewLocalWorkspace(ctx, nilProgram, auto.Project(project))
	if err != nil {
		fmt.Printf("Failed to create workspace: %v\n", err)
		os.Exit(1)
	}

	err = w.InstallPlugin(ctx, "azure", "v3.19.0")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}
	err = w.InstallPlugin(ctx, "random", "v2.3.1")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}

	stacks, err := w.ListStacks(ctx)
	if err != nil {
		fmt.Printf("failed to list stacks: %v\n", err)
		os.Exit(1)
	}

	expiration := time.Now().Add(-1 * threshold)

	var stacksToDestroy []string
	for _, stackSummary := range stacks {
		// don't clean up the networking stack or uninitialized stacks
		if stackSummary.LastUpdate == "" || stackSummary.Name == "networking" {
			continue
		}
		lastUpdateTime, err := time.Parse(time.RFC3339, stackSummary.LastUpdate)
		if err != nil {
			fmt.Printf("failed to parse stack update time: %v\n", err)
			os.Exit(1)
		}

		if lastUpdateTime.Before(expiration) {
			stacksToDestroy = append(stacksToDestroy, stackSummary.Name)
			fmt.Printf("Found expired stack %s last deployed at %s\n", stackSummary.Name, stackSummary.LastUpdate)
		}
	}

	fmt.Printf("Found %d stacks to clean up\n", len(stacksToDestroy))

	fails := 0
	success := 0

	for _, sName := range stacksToDestroy {
		s, err := auto.SelectStack(ctx, sName, w)
		if err != nil {
			fmt.Printf("failed to select stack: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("destroying stack %s\n", sName)

		// wire up our destroy to stream progress to stdout
		stdoutStreamer := optdestroy.ProgressStreams(os.Stdout)

		_, err = s.Destroy(ctx, stdoutStreamer)
		if err != nil {
			fmt.Printf("failed to clean up stack %s: %v\n", sName, err)
			fmt.Println("will try again in 60 seconds")
			fails++
			continue
		}
		success++

		fmt.Printf("removing stack %s and all associated config and history\n", sName)

		err = w.RemoveStack(ctx, sName)
		if err != nil {
			fmt.Printf("failed to remove stack %s: %v\n", sName, err)
		}

		fmt.Printf("stack %s successfully reaped \n", sName)
	}

	fmt.Printf("destroyed %d stack(s)\n", success)
	if fails > 0 {
		fmt.Printf("failed to destroy %d stacks, will retry next iteration\n", fails)
	}
	fmt.Println("finished reaping stacks")

}

package main

import (
	"context"
	"fmt"
	"os"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"

	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/events"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// define our program that creates our pulumi resources.
// we refer to this style as "inline" pulumi programs where both program + automation can be compiled in the same
// binary. no need for separate projects.
func pulumiProgram(ctx *pulumi.Context) error {
	// similar go git_repo_program, our program defines a s3 website.
	// here we create the bucket
	siteBucket, err := s3.NewBucket(ctx, "s3-website-bucket", &s3.BucketArgs{
		Website: s3.BucketWebsiteArgs{
			IndexDocument: pulumi.String("index.html"),
		},
	})
	if err != nil {
		return err
	}

	// we define and upload our HTML inline.
	indexContent := `<html><head>
		<title>Hello S3</title><meta charset="UTF-8">
	</head>
	<body><p>Hello, world!</p><p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
	</body></html>
`
	// upload our index.html
	if _, err := s3.NewBucketObject(ctx, "index", &s3.BucketObjectArgs{
		Bucket:      siteBucket.ID(), // reference to the s3.Bucket object
		Content:     pulumi.String(indexContent),
		Key:         pulumi.String("index.html"),               // set the key of the object
		ContentType: pulumi.String("text/html; charset=utf-8"), // set the MIME type of the file
	}); err != nil {
		return err
	}

	// Set the access policy for the bucket so all objects are readable.
	if _, err := s3.NewBucketPolicy(ctx, "bucketPolicy", &s3.BucketPolicyArgs{
		Bucket: siteBucket.ID(), // refer to the bucket created earlier
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect":    "Allow",
					"Principal": "*",
					"Action": []interface{}{
						"s3:GetObject",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("arn:aws:s3:::%s/*", siteBucket.ID()), // policy refers to bucket name explicitly
					},
				},
			},
		}),
	}); err != nil {
		return err
	}

	// export the website URL
	ctx.Export("websiteUrl", siteBucket.WebsiteEndpoint)
	return nil
}

func runPulumiUpdate(destroy bool, sub chan struct{}, events chan events.EngineEvent) tea.Cmd {
	return func() tea.Msg {
		ctx := context.Background()

		projectName := "inlineS3Project"
		// we use a simple stack name here, but recommend using auto.FullyQualifiedStackName for maximum specificity.
		stackName := "dev"
		// stackName := auto.FullyQualifiedStackName("myOrgOrUser", projectName, stackName)

		// create or select a stack matching the specified name and project.
		// this will set up a workspace with everything necessary to run our inline program (deployFunc)
		s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, pulumiProgram)
		if err != nil {
			fmt.Printf("Failed to get stack: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("Created/Selected stack %q\n", stackName)

		w := s.Workspace()

		fmt.Println("Installing the AWS plugin")

		// for inline source programs, we must manage plugins ourselves
		err = w.InstallPlugin(ctx, "aws", "v3.2.1")
		if err != nil {
			fmt.Printf("Failed to install program plugins: %v\n", err)
			os.Exit(1)
		}

		fmt.Println("Successfully installed AWS plugin")

		// set stack configuration specifying the AWS region to deploy
		err = s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

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

			eventStream := optdestroy.EventStreams(events)

			// destroy our stack and exit early
			_, err := s.Destroy(ctx, eventStream)
			if err != nil {
				fmt.Printf("Failed to destroy stack: %v", err)
			}
			fmt.Println("Stack successfully destroyed")
			os.Exit(0)
		}

		fmt.Println("Starting update")

		// wire up our event stream
		eventStream := optup.EventStreams(events)

		// run the update to deploy our s3 website
		res, err := s.Up(ctx, eventStream)
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
		return successMsg(<-sub)
	}
}

func watchForEvents(event chan events.EngineEvent) tea.Cmd {
	return func() tea.Msg {
		return <-event
	}
}

type successMsg struct{}

type model struct {
	events         chan events.EngineEvent // where we'll receive engine events
	sub            chan struct{}           // where we'll receive activity notifications
	spinner        spinner.Model
	destroy        bool
	eventsReceived int
	quitting       bool
}

func (m model) Init() tea.Cmd {
	return tea.Batch(
		runPulumiUpdate(m.destroy, m.sub, m.events),
		watchForEvents(m.events),
		spinner.Tick,
	)
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case events.EngineEvent:
		m.eventsReceived++                 // record external activity
		return m, watchForEvents(m.events) // wait for next event
	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	case tea.KeyMsg:
		m.quitting = true
		return m, tea.Quit
	case successMsg:
		m.quitting = true
		return m, tea.Quit
	default:
		return m, nil
	}
}

func (m model) View() string {
	s := fmt.Sprintf("\n %s Events received: %d\n\n Press any key to exit\n", m.spinner.View(), m.eventsReceived)
	if m.quitting {
		s += "\n"
	}
	return s
}

func main() {
	// to destroy our program, we can run `go run main.go destroy`
	destroy := false
	argsWithoutProg := os.Args[1:]
	if len(argsWithoutProg) > 0 {
		if argsWithoutProg[0] == "destroy" {
			destroy = true
		}
	}

	p := tea.NewProgram(model{
		sub:     make(chan struct{}),
		events:  make(chan events.EngineEvent),
		destroy: destroy,
		spinner: spinner.NewModel(),
	})

	if p.Start() != nil {
		fmt.Println("could not start program")
		os.Exit(1)
	}
}

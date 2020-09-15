package main

import (
	"context"
	"fmt"
	"os"

	"github.com/pulumi/pulumi-aws/sdk/v3/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
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
	stackName := "dev"

	fmt.Println("preparing website stack")
	websiteStack := createOrSelectWebsiteStack(ctx, stackName)
	fmt.Println("website stack ready to deploy")

	if destroy {
		// for destroying, we must remove stack in reverse order
		// this means retrieving any dependend outputs first
		fmt.Println("getting bucketID for object stack")

		// wire up our destroy to stream progress to stdout
		stdoutStreamer := optdestroy.ProgressStreams(os.Stdout)

		outs, err := websiteStack.Outputs(ctx)
		if err != nil {
			fmt.Printf("failed to get website outputs: %v\n", err)
			os.Exit(1)
		}
		bucketID, ok := outs["bucketID"].Value.(string)
		if !ok {
			fmt.Println("failed to get bucketID output")
			os.Exit(1)
		}
		fmt.Println("go bucketID for object stack")

		fmt.Println("preparing object stack")
		objectStack := createOrSelectObjectStack(ctx, stackName, bucketID)
		fmt.Println("object stack ready to deploy")

		// destroy our two stacks and exit early
		fmt.Println("Starting object stack destroy")
		_, err = objectStack.Destroy(ctx, stdoutStreamer)
		if err != nil {
			fmt.Printf("Failed to destroy object stack: %v", err)
		}
		fmt.Println("Object stack successfully destroyed")

		fmt.Println("Starting website stack destroy")
		_, err = websiteStack.Destroy(ctx, stdoutStreamer)
		if err != nil {
			fmt.Printf("Failed to destroy website stack: %v", err)
		}
		fmt.Println("Website stack successfully destroyed")

		os.Exit(0)
	}

	fmt.Println("Starting website stack update")

	// wire up our update to stream progress to stdout
	stdoutStreamer := optup.ProgressStreams(os.Stdout)

	// run the update to deploy our s3 website
	webRes, err := websiteStack.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}
	fmt.Println("Website stack update succeeded!")

	// get the bucketID output that object stack depends on
	bucketID, ok := webRes.Outputs["bucketID"].Value.(string)
	if !ok {
		fmt.Println("failed to get bucketID output")
		os.Exit(1)
	}
	fmt.Println("go bucketID for object stack")

	// initialize our object stack
	fmt.Println("preparing object stack")
	objectStack := createOrSelectObjectStack(ctx, stackName, bucketID)
	fmt.Println("object stack ready to deploy")

	fmt.Println("Starting object stack update")
	// run the update to deploy our object
	_, err = objectStack.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}
	fmt.Println("Object stack update succeeded!")

	// get the URL from the website stack outputs
	url, ok := webRes.Outputs["websiteUrl"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output URL")
		os.Exit(1)
	}

	fmt.Printf("URL: %s\n", url)
}

// this function gets our website stack ready for update/destroy
func createOrSelectWebsiteStack(ctx context.Context, stackName string) auto.Stack {
	project := "inlineMultiStackWebsite"
	return createOrSelectStack(ctx, project, stackName, websiteFunc)
}

// this function gets our object stack ready for update/destroy
func createOrSelectObjectStack(ctx context.Context, stackName, bucketID string) auto.Stack {
	project := "inlineMultiStackObject"
	return createOrSelectStack(ctx, project, stackName, getObjectFunc(bucketID))
}

// this function gets our stack ready for update/destroy by prepping the workspace, init/selecting the stack
// and doing a refresh to make sure state and cloud resources are in sync
func createOrSelectStack(ctx context.Context, projectName, stackName string, deployFunc pulumi.RunFunc) auto.Stack {
	// create or select a stack with an inline Pulumi program
	s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, deployFunc)
	if err != nil {
		fmt.Printf("Failed to create or select stack: %v\n", err)
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
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

	fmt.Println("Successfully set config")
	fmt.Println("Starting refresh")

	_, err = s.Refresh(ctx)
	if err != nil {
		fmt.Printf("Failed to refresh stack: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Refresh succeeded!")

	return s
}

// this is the inline pulumi function for our s3 bucket stack
func websiteFunc(ctx *pulumi.Context) error {
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
	// also export the bucketID for Object stack to refer to
	ctx.Export("bucketID", siteBucket.ID())
	return nil
}

// getObjectFunc is gets the pulumi function for our Object stack
func getObjectFunc(bucketID string) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {
		// we define and upload our HTML inline.
		indexContent := `<html><head>
		<title>Hello S3</title><meta charset="UTF-8">
	</head>
	<body><p>Hello, world!</p><p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
	</body></html>
	`
		// upload our index.html
		if _, err := s3.NewBucketObject(ctx, "index", &s3.BucketObjectArgs{
			// this bucket ID is curried into this function
			// it will be read as a stack output from our bucket stack
			Bucket:      pulumi.String(bucketID), // reference to the s3.Bucket object
			Content:     pulumi.String(indexContent),
			Key:         pulumi.String("index.html"),               // set the key of the object
			ContentType: pulumi.String("text/html; charset=utf-8"), // set the MIME type of the file
		}); err != nil {
			return err
		}

		return nil
	}
}

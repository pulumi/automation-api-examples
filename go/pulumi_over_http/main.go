package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/pulumi/pulumi-aws/sdk/v4/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"
	"github.com/pulumi/pulumi/sdk/v3/go/common/workspace"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// define request/response types for various REST ops

type CreateSiteReq struct {
	ID      string `json:"id"`
	Content string `json:"content"`
}

type UpdateSiteReq struct {
	Content string `json:"content"`
}

type SiteResponse struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

type ListSitesResponse struct {
	IDs []string `json:"ids"`
}

var project = "pulumi_over_http"

func main() {
	ensurePlugins()

	router := mux.NewRouter()

	// setup our RESTful routes for our Site resource
	router.HandleFunc("/sites", createHandler).Methods("POST")
	router.HandleFunc("/sites", listHandler).Methods("GET")
	router.HandleFunc("/sites/{id}", getHandler).Methods("GET")
	router.HandleFunc("/sites/{id}", updateHandler).Methods("PUT")
	router.HandleFunc("/sites/{id}", deleteHandler).Methods("DELETE")

	// define and start our http server
	s := &http.Server{
		Addr:    ":1337",
		Handler: router,
	}
	fmt.Println("starting server on :1337")
	log.Fatal(s.ListenAndServe())
}

// creates new sites
func createHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var createReq CreateSiteReq
	err := json.NewDecoder(req.Body).Decode(&createReq)
	if err != nil {
		w.WriteHeader(400)
		fmt.Fprintf(w, "failed to parse create request")
		return
	}

	ctx := context.Background()

	stackName := createReq.ID
	program := createPulumiProgram(createReq.Content)

	s, err := auto.NewStackInlineSource(ctx, stackName, project, program)
	if err != nil {
		// if stack already exists, 409
		if auto.IsCreateStack409Error(err) {
			w.WriteHeader(409)
			fmt.Fprintf(w, fmt.Sprintf("stack %q already exists", stackName))
			return
		}

		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

	// deploy the stack
	// we'll write all of the update logs to st	out so we can watch requests get processed
	upRes, err := s.Up(ctx, optup.ProgressStreams(os.Stdout))
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}

	response := &SiteResponse{
		ID:  stackName,
		URL: upRes.Outputs["websiteUrl"].Value.(string),
	}
	json.NewEncoder(w).Encode(&response)
}

// lists all sites
func listHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := context.Background()
	// set up a workspace with only enough information for the list stack operations
	ws, err := auto.NewLocalWorkspace(ctx, auto.Project(workspace.Project{
		Name:    tokens.PackageName(project),
		Runtime: workspace.NewProjectRuntimeInfo("go", nil),
	}))
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}
	stacks, err := ws.ListStacks(ctx)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}
	var ids []string
	for _, stack := range stacks {
		ids = append(ids, stack.Name)
	}

	response := &ListSitesResponse{
		IDs: ids,
	}
	json.NewEncoder(w).Encode(&response)
}

// gets info about a specific site
func getHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(req)
	stackName := params["id"]
	// we don't need a program since we're just getting stack outputs
	var program pulumi.RunFunc = nil
	ctx := context.Background()
	s, err := auto.SelectStackInlineSource(ctx, stackName, project, program)
	if err != nil {
		// if the stack doesn't already exist, 404
		if auto.IsSelectStack404Error(err) {
			w.WriteHeader(404)
			fmt.Fprintf(w, fmt.Sprintf("stack %q not found", stackName))
			return
		}

		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}

	// fetch the outputs from the stack
	outs, err := s.Outputs(ctx)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}

	response := &SiteResponse{
		ID:  stackName,
		URL: outs["websiteUrl"].Value.(string),
	}
	json.NewEncoder(w).Encode(&response)
}

// updates the content for an existing site
func updateHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var updateReq UpdateSiteReq
	err := json.NewDecoder(req.Body).Decode(&updateReq)
	if err != nil {
		w.WriteHeader(400)
		fmt.Fprintf(w, "failed to parse create request")
		return
	}

	ctx := context.Background()
	params := mux.Vars(req)
	stackName := params["id"]
	program := createPulumiProgram(updateReq.Content)

	s, err := auto.SelectStackInlineSource(ctx, stackName, project, program)
	if err != nil {
		if auto.IsSelectStack404Error(err) {
			w.WriteHeader(404)
			fmt.Fprintf(w, fmt.Sprintf("stack %q not found", stackName))
			return
		}

		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

	// deploy the stack
	// we'll write all of the update logs to st	out so we can watch requests get processed
	upRes, err := s.Up(ctx, optup.ProgressStreams(os.Stdout))
	if err != nil {
		// if we already have another update in progress, return a 409
		if auto.IsConcurrentUpdateError(err) {
			w.WriteHeader(409)
			fmt.Fprintf(w, "stack %q already has update in progress", stackName)
			return
		}

		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}

	response := &SiteResponse{
		ID:  stackName,
		URL: upRes.Outputs["websiteUrl"].Value.(string),
	}
	json.NewEncoder(w).Encode(&response)
}

// deletes a site
func deleteHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx := context.Background()
	params := mux.Vars(req)
	stackName := params["id"]
	// program doesn't matter for destroying a stack
	program := createPulumiProgram("")

	s, err := auto.SelectStackInlineSource(ctx, stackName, project, program)
	if err != nil {
		// if stack doesn't already exist, 404
		if auto.IsSelectStack404Error(err) {
			w.WriteHeader(404)
			fmt.Fprintf(w, fmt.Sprintf("stack %q not found", stackName))
			return
		}

		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

	// destroy the stack
	// we'll write all of the logs to stdout so we can watch requests get processed
	_, err = s.Destroy(ctx, optdestroy.ProgressStreams(os.Stdout))
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}

	// delete the stack and all associated history and config
	err = s.Workspace().RemoveStack(ctx, stackName)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, err.Error())
		return
	}

	w.WriteHeader(200)
}

// this function defines our pulumi S3 static website in terms of the content that the caller passes in.
// this allows us to dynamically deploy websites based on user defined values from the POST body.
func createPulumiProgram(content string) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {
		// our program defines a s3 website.
		// here we create the bucket
		siteBucket, err := s3.NewBucket(ctx, "s3-website-bucket", &s3.BucketArgs{
			Website: s3.BucketWebsiteArgs{
				IndexDocument: pulumi.String("index.html"),
			},
		})
		if err != nil {
			return err
		}

		// here our HTML is defined based on what the caller curries in.
		indexContent := content
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
}

// ensure plugins runs once before the server boots up
// making sure the proper pulumi plugins are installed
func ensurePlugins() {
	ctx := context.Background()
	w, err := auto.NewLocalWorkspace(ctx)
	if err != nil {
		fmt.Printf("Failed to setup and run http server: %v\n", err)
		os.Exit(1)
	}
	err = w.InstallPlugin(ctx, "aws", "v3.2.1")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}
}

package infra

import (
	"github.com/pulumi/pulumi-aws/sdk/v3/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
)

// WebsiteDeployFunc is a Pulumi program that deploys a static S3 website
func WebsiteDeployFunc(ctx *pulumi.Context) error {
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

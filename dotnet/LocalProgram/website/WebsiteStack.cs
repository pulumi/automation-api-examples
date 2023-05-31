using System.Collections.Generic;
using Pulumi;

namespace Website
{
    public class WebsiteStack : Pulumi.Stack
    {
        [Output]
        public Output<string> WebsiteUrl { get; private set; }

        public WebsiteStack()
        {
            // create a bucket and expose a website index document
            var siteBucket = new Pulumi.Aws.S3.Bucket(
                "s3-website-bucket",
                new Pulumi.Aws.S3.BucketArgs
                {
                    Website = new Pulumi.Aws.S3.Inputs.BucketWebsiteArgs
                    {
                        IndexDocument = "index.html",
                    },
                });

            const string indexContent = @"
<html>
    <head>
        <title>Hello S3</title><meta charset=""UTF-8"">
    </head>
    <body>
        <p>Hello, world!</p>
        <p>Made with ❤️ with <a href=""https://pulumi.com"">Pulumi</a></p>
    </body>
</html>
";

            // write our index.html into the site bucket
            var @object = new Pulumi.Aws.S3.BucketObject(
                "index",
                new Pulumi.Aws.S3.BucketObjectArgs
                {
                    Bucket = siteBucket.BucketName,
                    Content = indexContent,
                    ContentType = "text/html; charset=utf-8",
                    Key = "index.html",
                });

            // Add controls to allow access to bucket objects
            var bucketOwnership = new Pulumi.Aws.S3.BucketOwnershipControls(
                "ownership",
                new Pulumi.Aws.S3.BucketOwnershipControlsArgs
                {
                    Bucket = siteBucket.BucketName,
                    Rule = new Pulumi.Aws.S3.Inputs.BucketOwnershipControlsRuleArgs
                    {
                        ObjectOwnership = "ObjectWriter"
                    }
                }
            );

            var exampleBucketPublicAccessBlock = new Pulumi.Aws.S3.BucketPublicAccessBlock(
                "exampleBucketPublicAccessBlock", 
                new Pulumi.Aws.S3.BucketPublicAccessBlockArgs
                {
                    Bucket = siteBucket.BucketName,
                    BlockPublicAcls = false,
                });

            // create an S3 bucket policy to allow public read of all objects in bucket
            var bucketPolicyDocument = siteBucket.Arn.Apply(bucketArn =>
            {
                return Output.Create(Pulumi.Aws.Iam.GetPolicyDocument.InvokeAsync(
                    new Pulumi.Aws.Iam.GetPolicyDocumentArgs
                    {
                        Statements = new List<Pulumi.Aws.Iam.Inputs.GetPolicyDocumentStatementArgs>
                        {
                            new Pulumi.Aws.Iam.Inputs.GetPolicyDocumentStatementArgs
                            {
                                Effect = "Allow",
                                Principals = new List<Pulumi.Aws.Iam.Inputs.GetPolicyDocumentStatementPrincipalArgs>
                                {
                                    new Pulumi.Aws.Iam.Inputs.GetPolicyDocumentStatementPrincipalArgs
                                    {
                                        Identifiers = new List<string> { "*" },
                                        Type = "AWS",
                                    },
                                },
                                Actions = new List<string> { "s3:GetObject" },
                                Resources = new List<string> { $"{bucketArn}/*" },
                            },
                        },
                    }));
            });

            // set the access policy for the bucket so all objects are readable
            var bucketPolicy = new Pulumi.Aws.S3.BucketPolicy(
                "bucket-policy",
                new Pulumi.Aws.S3.BucketPolicyArgs
                {
                    Bucket = siteBucket.BucketName,
                    Policy = bucketPolicyDocument.Apply(x => x.Json),
                });

            // export url
            this.WebsiteUrl = siteBucket.WebsiteEndpoint;
        }
    }
}

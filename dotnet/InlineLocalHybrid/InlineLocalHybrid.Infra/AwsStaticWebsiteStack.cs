using Pulumi;

namespace InlineLocalHybrid.Infra;

public class AwsStaticWebsiteStack : Stack
{
	public AwsStaticWebsiteStack()
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
				<head><titl>Hello S3</title><meta charset=""UTF-8""></head>
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
				Bucket = siteBucket.BucketName, // reference to the s3 bucket object
						Content = indexContent,
				Key = "index.html", // set the key of the object
						ContentType = "text/html; charset=utf-8", // set the MIME type of the file
			});

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
		new Pulumi.Aws.S3.BucketPolicy(
			"bucket-policy",
			new Pulumi.Aws.S3.BucketPolicyArgs
			{
				Bucket = siteBucket.BucketName,
				Policy = bucketPolicyDocument.Apply(x => x.Json),
			});

		WebsiteEndpoint = siteBucket.WebsiteEndpoint;
	}

	[Output] public Output<string> WebsiteEndpoint { get; set; }
}

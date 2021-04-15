using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Pulumi;
using Pulumi.Automation;

namespace InlineProgram
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // define our pulumi program "inline"
            var program = PulumiFn.Create(() =>
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

                // export the website url
                return new Dictionary<string, object?>
                {
                    ["secret"] = Pulumi.Output.CreateSecret("hello world"),
                    ["website_url"] = siteBucket.WebsiteEndpoint,
                };
            });

            // to destroy our program, we can run "dotnet run destroy"
            var destroy = args.Any() && args[0] == "destroy";

            var projectName = "inline_s3_project";
            var stackName = "dev";
            var secretsProvider = "awskms://aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?region=us-west-2";
            var keyId = System.Environment.GetEnvironmentVariable("KMS_KEY");
            if (keyId != null) {
                secretsProvider = "awskms://" + keyId + "?region=" + System.Environment.GetEnvironmentVariable("AWS_REGION");
            }

            if (secretsProvider == "awskms://aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?region=us-west-2") {
                throw new Exception("Update secretsProvider to use an actual AWS KMS key.");
            }

            // create or select a stack matching the specified name and project
            // this will set up a workspace with everything necessary to run our inline program (program)
            var stackArgs = new InlineProgramArgs(projectName, stackName, program);
            stackArgs.SecretsProvider = secretsProvider;
            stackArgs.StackSettings = new Dictionary<string, StackSettings>(){
                [stackName] = new StackSettings(){
                    SecretsProvider = secretsProvider
                }
            };
            
            var stack = await LocalWorkspace.CreateOrSelectStackAsync(stackArgs);
            
            Console.WriteLine("successfully initialized stack");

            // for inline programs, we must manage plugins ourselves
            Console.WriteLine("installing plugins...");
            await stack.Workspace.InstallPluginAsync("aws", "v3.30.1");
            Console.WriteLine("plugins installed");

            // set stack configuration specifying the region to deploy
            Console.WriteLine("setting up config...");
            await stack.SetConfigAsync("aws:region", new ConfigValue("us-west-2"));
            Console.WriteLine("config set");

            Console.WriteLine("refreshing stack...");
            await stack.RefreshAsync(new RefreshOptions { OnStandardOutput = Console.WriteLine });
            Console.WriteLine("refresh complete");

            if (destroy)
            {
                Console.WriteLine("destroying stack...");
                await stack.DestroyAsync(new DestroyOptions { OnStandardOutput = Console.WriteLine });
                Console.WriteLine("stack destroy complete");
            }
            else
            {
                Console.WriteLine("updating stack...");
                var result = await stack.UpAsync(new UpOptions { OnStandardOutput = Console.WriteLine });

                if (result.Summary.ResourceChanges != null)
                {
                    Console.WriteLine("update summary:");
                    foreach (var change in result.Summary.ResourceChanges)
                        Console.WriteLine($"    {change.Key}: {change.Value}");
                }

                Console.WriteLine($"website url: {result.Outputs["website_url"].Value}");
            }
        }
    }
}

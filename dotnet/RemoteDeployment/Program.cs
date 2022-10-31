using System;
using Pulumi.Automation;

if (args.Length == 0)
{
    Console.WriteLine("usage: dotnet run <org> [destroy]");
    Environment.Exit(1);
}

string org = args[0];
const string project = "aws-ts-s3-folder";
var stackName = $"{org}/{project}/dev";
const string awsRegion = "us-west-2";

var stackArgs = new RemoteGitProgramArgs(stackName, "https://github.com/pulumi/examples.git")
{
    Branch = "refs/heads/master",
    ProjectPath = project,
    EnvironmentVariables =
    {
        { "AWS_REGION", new EnvironmentVariableValue(awsRegion) },
        { "AWS_ACCESS_KEY_ID", RequireFromEnvironment("AWS_ACCESS_KEY_ID") },
        { "AWS_SECRET_ACCESS_KEY", RequireFromEnvironment("AWS_SECRET_ACCESS_KEY", isSecret: true) },
        { "AWS_SESSION_TOKEN", RequireFromEnvironment("AWS_SESSION_TOKEN", isSecret: true) },
    },
};
var stack = await RemoteWorkspace.CreateOrSelectStackAsync(stackArgs);

bool destroy = args.Length > 1 && args[1] == "destroy";
if (destroy)
{
    await stack.DestroyAsync(new RemoteDestroyOptions { OnStandardOutput = Console.WriteLine });
    Console.WriteLine("Stack successfully destroyed");
}
else
{
    var result = await stack.UpAsync(new RemoteUpOptions { OnStandardOutput = Console.WriteLine });
    Console.WriteLine("Update succeeded!");
    Console.WriteLine($"url: {result.Outputs["websiteUrl"].Value}");
}

static EnvironmentVariableValue RequireFromEnvironment(string variable, bool isSecret = false)
{
    var value = Environment.GetEnvironmentVariable(variable)
        ?? throw new InvalidOperationException($"Required environment variable {variable} not set.");
    return new EnvironmentVariableValue(value, isSecret);
}

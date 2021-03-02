using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Pulumi.Automation;

namespace LocalProgram
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // to destroy our program, we can run "dotnet run destroy"
            var destroy = args.Any() && args[0] == "destroy";

            var stackName = "dev";

            // need to account for the assembly executing from within the bin directory
            // when getting path to the local program
            var executingDir = new DirectoryInfo(Assembly.GetExecutingAssembly().Location).Parent.FullName;
            var workingDir = Path.Combine(executingDir, "..", "..", "..", "..", "website");

            // create our stack using a local program in the ../../../../fargate directory
            var stackArgs = new LocalProgramArgs(stackName, workingDir);
            var stack = await LocalWorkspace.CreateOrSelectStackAsync(stackArgs);

            Console.WriteLine("successfully initialized stack");

            // set stack configuration specifying the region to deploy
            Console.WriteLine("setting up config...");
            await stack.SetConfigValueAsync("aws:region", new ConfigValue("us-west-2"));
            Console.WriteLine("config set");

            Console.WriteLine("refreshing stack...");
            await stack.RefreshAsync(new RefreshOptions { OnOutput = Console.WriteLine });
            Console.WriteLine("refresh complete");

            if (destroy)
            {
                Console.WriteLine("destroying stack...");
                await stack.DestroyAsync(new DestroyOptions { OnOutput = Console.WriteLine });
                Console.WriteLine("stack destroy complete");
            }
            else
            {
                Console.WriteLine("updating stack...");
                var result = await stack.UpAsync(new UpOptions { OnOutput = Console.WriteLine });

                if (result.Summary.ResourceChanges != null)
                {
                    Console.WriteLine("update summary:");
                    foreach (var change in result.Summary.ResourceChanges)
                        Console.WriteLine($"    {change.Key}: {change.Value}");
                }

                Console.WriteLine($"website url: {result.Outputs["WebsiteUrl"].Value}");
            }
        }
    }
}

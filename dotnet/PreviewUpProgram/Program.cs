using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Pulumi.Automation;
using Pulumi.Random;

class Program
{
    static async Task Main(string[] args)
    {
        // define our pulumi program "inline", other formats are supported see related other automation api examples
        var program = PulumiFn.Create(() =>
        {
            var petName = new RandomPet("name", new RandomPetArgs { });

            // export the random name
            return new Dictionary<string, object?>
            {
                ["name"] = petName.Id.Apply(i => i),
            };
        });
        var projectName = "inline_preview_up";
        var stackName = "dev";

        var destroy = args.Any() && args[0] == "destroy";
        var preview = args.Any() && args[0] == "preview";
        var up = args.Any() && args[0] == "up";

        var executingAssemblyLocation = System.Reflection.Assembly.GetExecutingAssembly().Location;
        var directory = Path.GetDirectoryName(executingAssemblyLocation);

        var planPath = (preview || up) && args.Length > 1
            ? args[1]
            : Path.Join(directory, $"{stackName}.{projectName}.json");

        // create or select a stack matching the specified name and project
        // this will set up a workspace with everything necessary to run our inline program (program)
        var stackArgs = new InlineProgramArgs(projectName, stackName, program);
        var stack = await LocalWorkspace.CreateOrSelectStackAsync(stackArgs);

        Console.WriteLine("successfully initialized stack");

        // for inline programs, we must manage plugins ourselves
        Console.WriteLine("installing plugins...");
        await stack.Workspace.InstallPluginAsync("random", "v4.8.2");
        Console.WriteLine("plugins installed");


        Console.WriteLine("refreshing stack...");
        await stack.RefreshAsync(new RefreshOptions { OnStandardOutput = Console.WriteLine });
        Console.WriteLine("refresh complete");

        if (destroy)
        {
            Console.WriteLine("destroying stack...");
            await stack.DestroyAsync(new DestroyOptions { OnStandardOutput = Console.WriteLine });
            Console.WriteLine("stack destroy complete");
        }
        else if (preview)
        {
            Console.WriteLine("previewing changes to stack...");

            var result = await stack.PreviewAsync(new PreviewOptions {OnStandardOutput = Console.WriteLine,  Plan = planPath });
            
            Console.WriteLine("preview summary:");
            foreach (var change in result.ChangeSummary)
                Console.WriteLine($"    {change.Key}: {change.Value}");


            Console.WriteLine($"stack preview saved to {planPath}");
        }
        else if (up)
        {
            Console.WriteLine($"updating stack from preview {planPath}...");
            var result = await stack.UpAsync(new UpOptions { OnStandardOutput = Console.WriteLine, Plan = planPath });

            if (result.Summary.ResourceChanges != null)
            {
                Console.WriteLine("update summary:");
                foreach (var change in result.Summary.ResourceChanges)
                    Console.WriteLine($"    {change.Key}: {change.Value}");
            }

            Console.WriteLine($"name: {result.Outputs["name"].Value}");
        }
        else
        {
            Console.WriteLine("no supported stack operations please provide preview, up or destroy as an argument");
        }
    }
}
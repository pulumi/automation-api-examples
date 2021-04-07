using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Pulumi;
using Pulumi.Automation;

namespace DatabaseMigration
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // define our pulumi program "inline"
            var program = PulumiFn.Create(() =>
            {
                // get default vpc
                var defaultVpc = Output.Create(Pulumi.Aws.Ec2.GetVpc.InvokeAsync(new Pulumi.Aws.Ec2.GetVpcArgs
                {
                    Default = true,
                }));

                // get public subnets
                var publicSubnetIds = defaultVpc.Apply(vpc =>
                {
                    return Output.Create(Pulumi.Aws.Ec2.GetSubnetIds.InvokeAsync(new Pulumi.Aws.Ec2.GetSubnetIdsArgs
                    {
                        VpcId = vpc.Id,
                    }));
                });

                var subnetGroup = new Pulumi.Aws.Rds.SubnetGroup(
                    "db-subnet",
                    new Pulumi.Aws.Rds.SubnetGroupArgs
                    {
                        SubnetIds = publicSubnetIds.Apply(x => x.Ids),
                    });

                // make a public security group for our cluster for the migration
                var securityGroup = new Pulumi.Aws.Ec2.SecurityGroup(
                    "public-security-group",
                    new Pulumi.Aws.Ec2.SecurityGroupArgs
                    {
                        Ingress = new Pulumi.Aws.Ec2.Inputs.SecurityGroupIngressArgs
                        {
                            Protocol = "-1",
                            FromPort = 0,
                            ToPort = 0,
                            CidrBlocks = "0.0.0.0/0"
                        },
                        Egress = new Pulumi.Aws.Ec2.Inputs.SecurityGroupEgressArgs
                        {
                            Protocol = "-1",
                            FromPort = 0,
                            ToPort = 0,
                            CidrBlocks = "0.0.0.0/0",
                        },
                    });

                // for example, you should change this
                var dbName = "hellosql";
                var dbUser = "hellosql";
                var dbPassword = "hellosql";

                // provision our db
                var cluster = new Pulumi.Aws.Rds.Cluster(
                    "db",
                    new Pulumi.Aws.Rds.ClusterArgs
                    {
                        Engine = Pulumi.Aws.Rds.EngineType.AuroraMysql,
                        EngineVersion = "5.7.mysql_aurora.2.03.2",
                        DatabaseName = dbName,
                        MasterUsername = dbUser,
                        MasterPassword = dbPassword,
                        SkipFinalSnapshot = true,
                        DbSubnetGroupName = subnetGroup.Name,
                        VpcSecurityGroupIds = securityGroup.Id,
                    });

                var clusterInstance = new Pulumi.Aws.Rds.ClusterInstance(
                    "db-instance",
                    new Pulumi.Aws.Rds.ClusterInstanceArgs
                    {
                        ClusterIdentifier = cluster.ClusterIdentifier,
                        InstanceClass = Pulumi.Aws.Rds.InstanceType.T3_Small,
                        Engine = Pulumi.Aws.Rds.EngineType.AuroraMysql.ToString(),
                        EngineVersion = "5.7.mysql_aurora.2.03.2",
                        PubliclyAccessible = true,
                        DbSubnetGroupName = subnetGroup.Name,
                    });

                // export the website url
                return new Dictionary<string, object?>
                {
                    ["host"] = cluster.Endpoint,
                    ["db_name"] = dbName,
                    ["db_user"] = dbUser,
                    ["db_pass"] = dbPassword,
                };
            });

            // to destroy our program, we can run "dotnet run destroy"
            var destroy = args.Any() && args[0] == "destroy";

            var projectName = "database_migration_project";
            var stackName = "dev";

            // create or select a stack matching the specified name and project
            // this will set up a workspace with everything necessary to run our inline program (program)
            var stackArgs = new InlineProgramArgs(projectName, stackName, program);
            var stack = await LocalWorkspace.CreateOrSelectStackAsync(stackArgs);

            Console.WriteLine("successfully initialized stack");

            // for inline programs, we must manage plugins ourselves
            Console.WriteLine("installing plugins...");
            await stack.Workspace.InstallPluginAsync("aws", "v4.0.0");
            Console.WriteLine("plugins installed");

            // set stack configuration specifying the region to deploy
            Console.WriteLine("setting up config...");
            await stack.SetConfigValueAsync("aws:region", new ConfigValue("us-west-2"));
            Console.WriteLine("config set");

            Console.WriteLine("refreshing stack...");
            await stack.RefreshAsync(new RefreshOptions { OnStandardOutput = Console.WriteLine });
            Console.WriteLine("refresh complete");

            if (destroy)
            {
                Console.WriteLine("destroying stack...");
                await stack.DestroyAsync(new DestroyOptions { OnStandardOutput = Console.WriteLine });
                Console.WriteLine("stack destroy complete");
                return;
            }

            Console.WriteLine("updating stack...");
            var result = await stack.UpAsync(new UpOptions { OnStandardOutput = Console.WriteLine });

            if (result.Summary.ResourceChanges != null)
            {
                Console.WriteLine("update summary:");
                foreach (var change in result.Summary.ResourceChanges)
                    Console.WriteLine($"    {change.Key}: {change.Value}");
            }

            Console.WriteLine($"db host url: {result.Outputs["host"].Value}");

            Console.WriteLine("configuring db...");
            var connectionStr = $"Server={result.Outputs["host"].Value};Database={result.Outputs["db_name"].Value};Uid={result.Outputs["db_user"].Value};Pwd={result.Outputs["db_pass"].Value};";
            using var connection = new MySqlConnection(connectionStr);
            await connection.OpenAsync();
            Console.WriteLine("db configured!");

            // make sure the table exists
            const string createTableQuery = @"
CREATE TABLE IF NOT EXISTS hello_pulumi(
id int(9) NOT NULL PRIMARY KEY,
color varchar(14) NOT NULL);";

            using var createCommand = new MySqlCommand(createTableQuery, connection);
            await createCommand.ExecuteNonQueryAsync();

            // seed the table with some data to start
            const string seedTableQuery = @"
INSERT IGNORE INTO hello_pulumi (id, color)
VALUES
    (1, 'Purple'),
    (2, 'Violet'),
    (3, 'Plum');";

            using var seedCommand = new MySqlCommand(seedTableQuery, connection);
            await seedCommand.ExecuteNonQueryAsync();

            Console.WriteLine("rows inserted!");
            Console.WriteLine("querying to verify data...");

            const string readTableQuery = "SELECT COUNT(*) FROM hello_pulumi;";
            using var readCommand = new MySqlCommand(readTableQuery, connection);
            var readResult = await readCommand.ExecuteScalarAsync();
            Console.WriteLine($"Result: {readResult} rows");

            Console.WriteLine("database, table, and rows successfully configured");
        }
    }
}

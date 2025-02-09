package com.example;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import com.pulumi.Context;
import com.pulumi.aws.ec2.Ec2Functions;
import com.pulumi.aws.ec2.SecurityGroup;
import com.pulumi.aws.ec2.SecurityGroupArgs;
import com.pulumi.aws.ec2.inputs.GetSubnetsArgs;
import com.pulumi.aws.ec2.inputs.GetSubnetsFilterArgs;
import com.pulumi.aws.ec2.inputs.GetVpcArgs;
import com.pulumi.aws.ec2.inputs.SecurityGroupEgressArgs;
import com.pulumi.aws.ec2.inputs.SecurityGroupIngressArgs;
import com.pulumi.aws.ec2.outputs.GetVpcResult;
import com.pulumi.aws.rds.Cluster;
import com.pulumi.aws.rds.ClusterArgs;
import com.pulumi.aws.rds.ClusterInstance;
import com.pulumi.aws.rds.ClusterInstanceArgs;
import com.pulumi.aws.rds.SubnetGroup;
import com.pulumi.aws.rds.SubnetGroupArgs;
import com.pulumi.aws.rds.enums.EngineType;
import com.pulumi.experimental.automation.ConfigValue;
import com.pulumi.experimental.automation.DestroyOptions;
import com.pulumi.experimental.automation.LocalWorkspace;
import com.pulumi.experimental.automation.RefreshOptions;
import com.pulumi.experimental.automation.UpOptions;

public class App {
    public static void main(String[] args) {

        // Define our Pulumi program "inline"
        Consumer<Context> program = ctx -> {
            // Get default vpc id
            var vpcId = Ec2Functions.getVpc(
                    GetVpcArgs.builder().default_(true).build()
            ).applyValue(GetVpcResult::id);

            // Get public subnets
            var subnetIds = Ec2Functions.getSubnets(GetSubnetsArgs.builder()
                .filters(GetSubnetsFilterArgs.builder()
                        .name("vpc-id")
                        .values(vpcId.applyValue(List::of))
                        .build())
                .build())
                .applyValue(getSubnetsResult -> getSubnetsResult.ids()
                        .stream()
                        .sorted()
                        .limit(2)
                        .collect(Collectors.toList()));

            var subnetGroup = new SubnetGroup("db-subnet", SubnetGroupArgs.builder()
                    .subnetIds(subnetIds)
                    .build());

            // Make a public security group for our cluster for the migration
            var securityGroup = new SecurityGroup("public-security-group", SecurityGroupArgs.builder()
                    .ingress(SecurityGroupIngressArgs.builder()
                            .protocol("-1")
                            .fromPort(0)
                            .toPort(0)
                            .cidrBlocks("0.0.0.0/0")
                            .build())
                    .egress(SecurityGroupEgressArgs.builder()
                            .protocol("-1")
                            .fromPort(0)
                            .toPort(0)
                            .cidrBlocks("0.0.0.0/0")
                            .build())
                    .build());

            // For example, you should change this
            var dbName = "hellosql";
            var dbUser = "hellosql";
            var dbPassword = "hellosql";

            // Provision our db
            var cluster = new Cluster("db", ClusterArgs.builder()
                    .engine(EngineType.AuroraMysql)
                    .engineVersion("8.0.mysql_aurora.3.08.0")
                    .databaseName(dbName)
                    .masterUsername(dbUser)
                    .masterPassword(dbPassword)
                    .skipFinalSnapshot(true)
                    .dbSubnetGroupName(subnetGroup.name())
                    .vpcSecurityGroupIds(securityGroup.id().applyValue(List::of))
                    .build());

            var clusterInstance = new ClusterInstance("db-instance", ClusterInstanceArgs.builder()
                    .clusterIdentifier(cluster.clusterIdentifier())
                    .instanceClass("db.t3.medium")
                    .engine(EngineType.AuroraMysql.getValue())
                    .engineVersion("8.0.mysql_aurora.3.08.0")
                    .publiclyAccessible(true)
                    .dbSubnetGroupName(subnetGroup.name())
                    .build());

            ctx.export("host", cluster.endpoint());
            ctx.export("db_name", dbName);
            ctx.export("db_user", dbUser);
            ctx.export("db_pass", dbPassword);
        };

        // To destroy our program, we can run:
        // mvn -q compile exec:java -Dexec.args="destroy"
        var destroy = args.length > 0 && "destroy".equals(args[0]);

        var projectName = "database_migration_project";
        var stackName = "dev";

        // Create or select a stack matching the specified name and project.
        // This will set up a workspace with everything necessary to run our inline
        // Pulumi program.
        try (var stack = LocalWorkspace.createOrSelectStack(projectName, stackName, program)) {
            System.out.println("successfully initialized stack");

            // For inline programs, we must manage plugins ourselves
            System.out.println("installing plugins...");
            stack.getWorkspace().installPlugin("aws", "v6.68.0");
            System.out.println("plugins installed");

            // Set stack configuration specifying the region to deploy
            System.out.println("setting up config...");
            stack.setConfig("aws:region", new ConfigValue("us-west-2"));
            System.out.println("config set");

            // Run refresh
            System.out.println("refreshing stack...");
            stack.refresh(RefreshOptions.builder()
                    .onStandardOutput(System.out::println)
                    .build());
            System.out.println("refresh complete");

            if (destroy) {
                System.out.println("destroying stack...");
                stack.destroy(DestroyOptions.builder()
                        .onStandardOutput(System.out::println)
                        .build());
                System.out.println("stack destroy complete");
                return;
            }

            System.out.println("updating stack...");
            var result = stack.up(UpOptions.builder()
                    .onStandardOutput(System.out::println)
                    .build());

            var changes = result.getSummary().getResourceChanges();
            if (!changes.isEmpty()) {
                System.out.println("update summary:");
                changes.forEach((key, value) -> {
                    System.out.printf("    %s: $d%n", key, value);
                });
            }

            System.out.printf("db host url: %s%n", result.getOutputs().get("host").getValue());
            configureDatabase(
                    (String) result.getOutputs().get("host").getValue(),
                    (String) result.getOutputs().get("db_name").getValue(),
                    (String) result.getOutputs().get("db_user").getValue(),
                    (String) result.getOutputs().get("db_pass").getValue());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void configureDatabase(String host, String database, String user, String password) throws SQLException {
        System.out.println("configuring db...");

        // Register JDBC driver
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found", e);
        }

        var url = String.format("jdbc:mysql://%s/%s",
                host,
                database);

        try (var connection = DriverManager.getConnection(url, user, password)) {
            System.out.println("db configured!");

            // Make sure the table exists
            var createTableQuery = "CREATE TABLE IF NOT EXISTS hello_pulumi(" +
                    "id int(9) NOT NULL PRIMARY KEY, " +
                    "color varchar(14) NOT NULL);";

            try (var createStatement = connection.prepareStatement(createTableQuery)) {
                createStatement.executeUpdate();
            }

            // Seed the table with some data to start
            var seedTableQuery = "INSERT IGNORE INTO hello_pulumi (id, color) " +
                    "VALUES " +
                    "    (1, 'Purple'), " +
                    "    (2, 'Violet'), " +
                    "    (3, 'Plum');";

            try (var seedStatement = connection.prepareStatement(seedTableQuery)) {
                seedStatement.executeUpdate();
            }

            System.out.println("rows inserted!");
            System.out.println("querying to verify data...");

            var readTableQuery = "SELECT COUNT(*) FROM hello_pulumi;";
            try (var readStatement = connection.prepareStatement(readTableQuery)) {
                var resultSet = readStatement.executeQuery();
                if (resultSet.next()) {
                    System.out.println("Result: " + resultSet.getInt(1) + " rows");
                }
            }

            System.out.println("database, table, and rows successfully configured");
        }
    }
}

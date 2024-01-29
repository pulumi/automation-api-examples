import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as mysql from "mysql";

const process = require('process');

const args = process.argv.slice(2);
let destroy = false;
if (args.length > 0 && args[0]) {
    destroy = args[0] === "destroy";
}



const run = async () => {
    // This is our pulumi program in "inline function" form
    const pulumiProgram = async () => {
        const vpc = awsx.ec2.Vpc.getDefault();
        const subnetGroup = new aws.rds.SubnetGroup("dbsubnet", {
            subnetIds: vpc.publicSubnetIds,
        });

        // make a public SG for our cluster for the migration
        const securityGroup = new awsx.ec2.SecurityGroup("publicGroup", {
            egress: [
                {
                    protocol: "-1",
                    fromPort: 0,
                    toPort: 0,
                    cidrBlocks: ["0.0.0.0/0"],
                }
            ],
            ingress: [
                {
                    protocol: "-1",
                    fromPort: 0,
                    toPort: 0,
                    cidrBlocks: ["0.0.0.0/0"],
                }
            ]
        });

        // example only, you should change this
        const dbName = "hellosql";
        const dbUser = "hellosql";
        const dbPass = "hellosql";

        // provision our db
        const cluster = new aws.rds.Cluster("db", {
            engine: aws.rds.EngineType.AuroraMysql,
            engineVersion: "5.7.mysql_aurora.2.12.1",
            databaseName: dbName,
            masterUsername: dbUser,
            masterPassword: dbPass,
            skipFinalSnapshot: true,
            dbSubnetGroupName: subnetGroup.name,
            vpcSecurityGroupIds: [securityGroup.id],
        });

        const clusterInstance = new aws.rds.ClusterInstance("dbInstance", {
            clusterIdentifier: cluster.clusterIdentifier,
            instanceClass: aws.rds.InstanceType.T3_Small,
            engine: aws.rds.EngineType.AuroraMysql,
            engineVersion: "5.7.mysql_aurora.2.12.1",
            publiclyAccessible: true,
            dbSubnetGroupName: subnetGroup.name,
        });

        return {
            host: pulumi.interpolate`${cluster.endpoint}`,
            dbName,
            dbUser,
            dbPass
        };
    };

    // Create our stack 
    const args: InlineProgramArgs = {
        stackName: "dev",
        projectName: "databaseMigration",
        program: pulumiProgram
    };

    // create (or select if one already exists) a stack that uses our inline program
    const stack = await LocalWorkspace.createOrSelectStack(args);

    console.info("successfully initialized stack");
    console.info("installing plugins...");
    await stack.workspace.installPlugin("aws", "v4.0.0");
    console.info("plugins installed");
    console.info("setting up config");
    await stack.setConfig("aws:region", { value: aws.Region.USWest2 });
    console.info("config set");
    console.info("refreshing stack...");
    await stack.refresh({ onOutput: console.info });
    console.info("refresh complete");

    if (destroy) {
        console.info("destroying stack...");
        await stack.destroy({ onOutput: console.info });
        console.info("stack destroy complete");
        process.exit(0);
    }

    console.info("updating stack...");
    const upRes = await stack.up({ onOutput: console.info });
    console.log(`update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
    console.log(`db host url: ${upRes.outputs.host.value}`);
    console.info("configuring db...");

    // establish mysql client
    const connection = mysql.createConnection({
        host: upRes.outputs.host.value,
        user: upRes.outputs.dbUser.value,
        password: upRes.outputs.dbPass.value,
        database: upRes.outputs.dbName.value
    });

    connection.connect();

    console.log("creating table...")

    // make sure the table exists
    connection.query(`
    CREATE TABLE IF NOT EXISTS hello_pulumi(
        id int(9) NOT NULL,
        color varchar(14) NOT NULL,
        PRIMARY KEY(id)
    );
    `, function (error, results, fields) {
        if (error) throw error;
        console.log("table created!")
        console.log('Result: ', JSON.stringify(results));
        console.log("seeding initial data...")
    });

    // seed the table with some data to start
    connection.query(`
    INSERT IGNORE INTO hello_pulumi (id, color)
    VALUES
        (1, 'Purple'),
        (2, 'Violet'),
        (3, 'Plum');
    `, function (error, results, fields) {
        if (error) throw error;
        console.log("rows inserted!")
        console.log('Result: ', JSON.stringify(results));
        console.log("querying to verify data...")
    });


    // read the data back
    connection.query(`SELECT COUNT(*) FROM hello_pulumi;`, function (error, results, fields) {
        if (error) throw error;
        console.log('Result: ', JSON.stringify(results));
        console.log("database, tables, and rows successfully configured!")
    });

    connection.end();
};

run().catch(err => console.log(err));

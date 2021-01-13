package main

import (
	"context"
	"fmt"
	"os"

	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/pulumi/pulumi-aws/sdk/v3/go/aws/ec2"
	"github.com/pulumi/pulumi-aws/sdk/v3/go/aws/rds"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v2/go/x/auto/optup"
)

func main() {
	// to destroy our program, we can run `go run main.go destroy`
	destroy := false
	argsWithoutProg := os.Args[1:]
	if len(argsWithoutProg) > 0 {
		if argsWithoutProg[0] == "destroy" {
			destroy = true
		}
	}

	// this inline pulumi program provisions our database. Later on, we'll read read values
	// out of the update result to configure our database via a "migration"
	deployFunc := func(ctx *pulumi.Context) error {
		// Read back the default VPC and public subnets, which we will use.
		t := true
		vpc, err := ec2.LookupVpc(ctx, &ec2.LookupVpcArgs{Default: &t})
		if err != nil {
			return err
		}
		subnetIds, err := ec2.GetSubnetIds(ctx, &ec2.GetSubnetIdsArgs{VpcId: vpc.Id})
		if err != nil {
			return err
		}
		var subIds pulumi.StringArray
		for _, id := range subnetIds.Ids {
			subIds = append(subIds, pulumi.String(id))
		}
		subnetGroup, err := rds.NewSubnetGroup(ctx, "dbsubnet", &rds.SubnetGroupArgs{
			SubnetIds: subIds,
		})
		// make a public SG for our cluster for the migration
		openSg, err := ec2.NewSecurityGroup(ctx, "web-sg", &ec2.SecurityGroupArgs{
			VpcId: pulumi.String(vpc.Id),
			Egress: ec2.SecurityGroupEgressArray{
				ec2.SecurityGroupEgressArgs{
					Protocol:   pulumi.String("-1"),
					FromPort:   pulumi.Int(0),
					ToPort:     pulumi.Int(0),
					CidrBlocks: pulumi.StringArray{pulumi.String("0.0.0.0/0")},
				},
			},
			Ingress: ec2.SecurityGroupIngressArray{
				ec2.SecurityGroupIngressArgs{
					Protocol:   pulumi.String("-1"),
					FromPort:   pulumi.Int(0),
					ToPort:     pulumi.Int(0),
					CidrBlocks: pulumi.StringArray{pulumi.String("0.0.0.0/0")},
				},
			},
		})
		if err != nil {
			return err
		}

		// example only, you should change this
		dbName := pulumi.String("hellosql")
		dbUser := pulumi.String("hellosql")
		dbPass := pulumi.String("hellosql")

		// provision our db
		cluster, err := rds.NewCluster(ctx, "db", &rds.ClusterArgs{
			Engine:              rds.EngineTypeAuroraMysql,
			EngineVersion:       pulumi.String("5.7.mysql_aurora.2.03.2"),
			DatabaseName:        dbName,
			MasterUsername:      dbUser,
			MasterPassword:      dbPass,
			SkipFinalSnapshot:   pulumi.Bool(true),
			DbSubnetGroupName:   subnetGroup.Name,
			VpcSecurityGroupIds: pulumi.StringArray{openSg.ID()},
		})
		if err != nil {
			return err
		}

		_, err = rds.NewClusterInstance(ctx, "dbInstance", &rds.ClusterInstanceArgs{
			ClusterIdentifier:  cluster.ClusterIdentifier,
			InstanceClass:      rds.InstanceType_T3_Small,
			Engine:             rds.EngineTypeAuroraMysql,
			EngineVersion:      pulumi.String("5.7.mysql_aurora.2.03.2"),
			PubliclyAccessible: pulumi.Bool(true),
			DbSubnetGroupName:  subnetGroup.Name,
		})
		if err != nil {
			return err
		}

		ctx.Export("host", cluster.Endpoint)
		ctx.Export("dbName", dbName)
		ctx.Export("dbUser", dbUser)
		ctx.Export("dbPass", dbPass)
		return nil
	}

	ctx := context.Background()

	projectName := "databaseMigration"
	// we use a simple stack name here, but recommend using auto.FullyQualifiedStackName for maximum specificity.
	stackName := "dev1"
	// stackName := auto.FullyQualifiedStackName("myOrgOrUser", projectName, stackName)

	// create or select a stack matching the specified name and project.
	// this will set up a workspace with everything necessary to run our inline program (deployFunc)
	s, err := auto.UpsertStackInlineSource(ctx, stackName, projectName, deployFunc)

	fmt.Printf("Created/Selected stack %q\n", stackName)

	w := s.Workspace()

	fmt.Println("Installing the AWS plugin")

	// for inline source programs, we must manage plugins ourselves
	err = w.InstallPlugin(ctx, "aws", "v3.23.0")
	if err != nil {
		fmt.Printf("Failed to install program plugins: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Successfully installed AWS plugin")

	// set stack configuration specifying the AWS region to deploy
	s.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: "us-west-2"})

	fmt.Println("Successfully set config")
	fmt.Println("Starting refresh")

	_, err = s.Refresh(ctx)
	if err != nil {
		fmt.Printf("Failed to refresh stack: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Refresh succeeded!")

	if destroy {
		fmt.Println("Starting stack destroy")

		// wire up our destroy to stream progress to stdout
		stdoutStreamer := optdestroy.ProgressStreams(os.Stdout)

		// destroy our stack and exit early
		_, err := s.Destroy(ctx, stdoutStreamer)
		if err != nil {
			fmt.Printf("Failed to destroy stack: %v", err)
		}
		fmt.Println("Stack successfully destroyed")
		os.Exit(0)
	}

	fmt.Println("Starting update")

	// wire up our update to stream progress to stdout
	stdoutStreamer := optup.ProgressStreams(os.Stdout)

	// run the update to deploy our s3 website
	res, err := s.Up(ctx, stdoutStreamer)
	if err != nil {
		fmt.Printf("Failed to update stack: %v\n\n", err)
		os.Exit(1)
	}

	fmt.Println("Update succeeded!")

	// get the connection info
	host, ok := res.Outputs["host"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output")
		os.Exit(1)
	}
	dbName, ok := res.Outputs["dbName"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output")
		os.Exit(1)
	}
	dbUser, ok := res.Outputs["dbUser"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output")
		os.Exit(1)
	}
	dbPass, ok := res.Outputs["dbPass"].Value.(string)
	if !ok {
		fmt.Println("Failed to unmarshall output")
		os.Exit(1)
	}

	fmt.Printf("host: %s\n", host)

	// establish db connection
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", dbUser, dbPass, host, dbName))
	if err != nil {
		fmt.Printf("failed to connect to db: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	// run our database "migration"
	fmt.Println("creating table...")
	_, err = db.Query(`
    CREATE TABLE IF NOT EXISTS hello_pulumi(
        id int(9) NOT NULL,
        color varchar(14) NOT NULL,
        PRIMARY KEY(id)
    );
    `)
	if err != nil {
		fmt.Printf("failed to create table: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("table created!")
	fmt.Println("inserting initial rows...")
	_, err = db.Query(`
    INSERT IGNORE INTO hello_pulumi (id, color)
    VALUES
        (1, 'Purple'),
        (2, 'Violet'),
        (3, 'Plum');
    `)
	if err != nil {
		fmt.Printf("failed to insert rows: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("rows inserted!")
	fmt.Println("querying to verify data...")
	row := db.QueryRow(`SELECT COUNT(*) FROM hello_pulumi;`)
	var count string
	row.Scan(&count)
	fmt.Printf("%s rows read!\n", count)
	fmt.Println("database, tables, and rows successfuly configured!")
}

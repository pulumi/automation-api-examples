import sys
import json
import pulumi
import pulumi_aws as aws
from pulumi import automation as auto
from mysql.connector import connect


# This is our pulumi program in "inline function" form
def pulumi_program():
    default_vpc = aws.ec2.get_vpc(default=True)
    public_subnet_ids = aws.ec2.get_subnet_ids(vpc_id=default_vpc.id)
    subnet_group = aws.rds.SubnetGroup("db_subnet", subnet_ids=public_subnet_ids.ids)

    # make a public security group for our cluster for the migration
    security_group = aws.ec2.SecurityGroup("public_group",
                                           ingress=[aws.ec2.SecurityGroupIngressArgs(
                                               protocol="-1",
                                               from_port=0,
                                               to_port=0,
                                               cidr_blocks=["0.0.0.0/0"]
                                           )],
                                           egress=[aws.ec2.SecurityGroupEgressArgs(
                                              protocol="-1",
                                              from_port=0,
                                              to_port=0,
                                              cidr_blocks=["0.0.0.0/0"]
                                           )])

    # example on, you should change this
    db_name = "hellosql"
    db_user = "hellosql"
    db_pass = "hellosql"

    # provision our db
    cluster = aws.rds.Cluster("db",
                              engine=aws.rds.EngineType.AURORA_MYSQL,
                              engine_version="5.7.mysql_aurora.2.03.2",
                              database_name=db_name,
                              master_username=db_user,
                              master_password=db_pass,
                              skip_final_snapshot=True,
                              db_subnet_group_name=subnet_group.name,
                              vpc_security_group_ids=[security_group.id])

    cluster_instance = aws.rds.ClusterInstance("db_instance",
                                               cluster_identifier=cluster.cluster_identifier,
                                               instance_class=aws.rds.InstanceType.T3_SMALL,
                                               engine=aws.rds.EngineType.AURORA_MYSQL,
                                               engine_version="5.7.mysql_aurora.2.03.2",
                                               publicly_accessible=True,
                                               db_subnet_group_name=subnet_group.name)

    pulumi.export("host", cluster.endpoint)
    pulumi.export("db_name", db_name)
    pulumi.export("db_user", db_user)
    pulumi.export("db_pass", db_pass)


# To destroy our program, we can run python main.py destroy
destroy = False
args = sys.argv[1:]
if len(args) > 0:
    if args[0] == "destroy":
        destroy = True

project_name = "database_migration"
stack_name = "dev"

# create (or select if one already exists) a stack that uses our inline program
stack = auto.create_or_select_stack(stack_name=stack_name,
                                    project_name=project_name,
                                    program=pulumi_program)

print("successfully initialized stack")

# for inline programs, we must manage plugins ourselves
print("installing plugins...")
stack.workspace.install_plugin("aws", "v4.0.0")
print("plugins installed")

# set stack configuration specifying the AWS region to deploy
print("setting up config")
stack.set_config("aws:region", auto.ConfigValue(value="us-west-2"))
print("config set")

print("refreshing stack...")
stack.refresh(on_output=print)
print("refresh complete")

if destroy:
    print("destroying stack...")
    stack.destroy(on_output=print)
    print("stack destroy complete")
    sys.exit()

print("updating stack...")
up_res = stack.up(on_output=print)
print(f"update summary: \n{json.dumps(up_res.summary.resource_changes, indent=4)}")
print(f"db host url: {up_res.outputs['host'].value}")

print("configuring db...")
with connect(
        host=up_res.outputs['host'].value,
        user=up_res.outputs['db_user'].value,
        password=up_res.outputs['db_pass'].value,
        database=up_res.outputs['db_name'].value) as connection:
    print("db configured!")

    # make sure the table exists
    print("creating table...")
    create_table_query = """CREATE TABLE IF NOT EXISTS hello_pulumi(
        id int(9) NOT NULL PRIMARY KEY,
        color varchar(14) NOT NULL);
        """
    with connection.cursor() as cursor:
        cursor.execute(create_table_query)
        connection.commit()

    # seed the table with some data to start
    seed_table_query = """INSERT IGNORE INTO hello_pulumi (id, color)
    VALUES
        (1, 'Purple'),
        (2, 'Violet'),
        (3, 'Plum');
    """
    with connection.cursor() as cursor:
        cursor.execute(seed_table_query)
        connection.commit()

    print("rows inserted!")
    print("querying to verify data...")

    # read the data back
    read_table_query = """SELECT COUNT(*) FROM hello_pulumi;"""
    with connection.cursor() as cursor:
        cursor.execute(read_table_query)
        result = cursor.fetchone()
        print(f"Result: {json.dumps(result)}")

    print("database, table and rows successfully configured")


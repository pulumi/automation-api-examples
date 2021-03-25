import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import * as pulumi from "@pulumi/pulumi";

const project = pulumi.getProject();
const stack = pulumi.getStack();
const tags = { project, stack, Name: `${project}-${stack}` };
const config = new pulumi.Config();

/**
 * Get details of default vpc to use for resources.
 */
const vpc = aws.ec2.getVpc({ default: true });
const vpcId = vpc.then(it => it.id);
const vpcCidrBlock = vpc.then(it => it.cidrBlock);

const subnets = vpc.then(it => aws.ec2.getSubnetIds({ vpcId: it.id }));
const allSubnetIds = subnets.then(it => it.ids);
const firstSubnetId = subnets.then(it => it.ids[0]);

/**
 * Provision bastion resources.
 */
const amiId = aws.ec2.getAmi({
    owners: ["099720109477"], // Ubuntu
    mostRecent: true,
    filters: [{ name: "name", values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"] }],
}).then(it => it.id);

const sshSg = new aws.ec2.SecurityGroup(`bastion`, {
    vpcId: vpcId,
    ingress: [{ protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] }],
    egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
    tags
});

const sshKey = new aws.ec2.KeyPair("bastion", { publicKey: config.require("publicKey") });

const bastion = new aws.ec2.Instance("bastion", {
    instanceType: aws.ec2.InstanceTypes.T3_Small,
    ami: amiId,
    subnetId: firstSubnetId,
    vpcSecurityGroupIds: [sshSg.id],
    associatePublicIpAddress: true,
    keyName: sshKey.keyName,
    tags,
});

export const bastionHost = bastion.publicIp;

/**
 * Provision database resources.
 */
 const postgresSg = new aws.ec2.SecurityGroup("db", {
    vpcId,
    ingress: [{ protocol: "tcp", fromPort: 5432, toPort: 5432, cidrBlocks: [vpcCidrBlock] }],
    egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: [vpcCidrBlock] }],
});
const dbSubnets = new aws.rds.SubnetGroup("db", {
    subnetIds: allSubnetIds,
    tags,
});
const password = new random.RandomPassword("db", {
    length: 32,
    // https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBInstance.html#API_CreateDBInstance_RequestParameters:~:text=The%20password%20for%20the%20master%20user.,character%20except%20%22%2F%22%2C%20%22%22%22%2C%20or%20%22%40%22.
    overrideSpecial: "!#$%&*()-_=+[]{}<>:?",
});
const db = new aws.rds.Instance("db", {
    engine: "postgres",

    instanceClass: "db.t3.xlarge",
    allocatedStorage: 20,

    dbSubnetGroupName: dbSubnets.id,
    vpcSecurityGroupIds: [postgresSg.id],
    publiclyAccessible: false,

    username: "admin2021",
    password: password.result,

    skipFinalSnapshot: true,
    tags,
});

export const dbHost = db.address;
export const dbUsername = db.username;
export const dbPassword = db.password;

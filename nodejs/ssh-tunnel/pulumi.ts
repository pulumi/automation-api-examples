import * as auto from "@pulumi/pulumi/automation";
import * as child_process from "child_process";
import * as fs from "fs";

const vpcWorkDir = "./vpc";
const dbWorkDir = "./database";

const command = process.argv[2];
const stackName = process.argv[3];
const publicKeyFilePath = process.argv[4];

/**
 * Print a message to the console with a "banner" outline.
 */
function banner(...message: string[]) {
    console.log(`################################################################################`);
    console.log(`#`);
    message.forEach(it => console.log(`# ${it}`));
    console.log(`#`);
    console.log(`################################################################################`);
}

function installDependencies(workDirs: string[]) {
    banner(`Installing dependencies for [${workDirs}]... `);
    for (let i = 0; i < workDirs.length; i++) {
        const path = workDirs[i];
        if (fs.existsSync(`${path}/node_modules`)) {
            continue;
        }
        child_process.execSync("npm install", { cwd: path });
    }
};

/**
 * Starts an SSH tunnel.
 * 
 * Requires that the ssh key is already trusted with `ssh-agent`.
 * Could be modified to take the ssh private key as an input.
 */
function startSshTunnel(bastionHost: string, targetHost: string) {
    if (bastionHost === undefined) {
        banner(`Bastion host is undefined. Skipping tunnel creation...`);
        return;
    }
    const port = "5432";
    banner(`Establishing tunnel through [${bastionHost}] to [${targetHost}] on port [${port}]...`);
    return child_process.spawn(
        `/usr/bin/ssh`, [`-L`, `${port}:${targetHost}:${port}`, `ubuntu@${bastionHost}`]
    );
}

/**
 * Stops the SSH tunnel.
 */
function stopSshTunnel(tunnel: child_process.ChildProcessWithoutNullStreams | undefined) {
    if (tunnel === undefined) {
        return;
    }
    banner(`Stopping tunnel...`);
    tunnel.kill();
}

async function preview() {
    banner("Preview is not currently implemented, but could be easily added. "
        , "In its current form, a `preview` would fail on the first `up` because "
        , "the bastion host would not be available.");
    process.exit(1);
}

/**
 * `up` the stacks in the appropriate order:
 * 1. `up` the vpc and rds resources
 * 2. establish private connectivity
 * 3. `up` the database resources
 */
async function up(stackName: string, publicKey: string) {
    let tunnel: child_process.ChildProcessWithoutNullStreams | undefined;
    try {
        installDependencies([vpcWorkDir, dbWorkDir]);

        /**
         * Provision VPC, Bastion, and RDS.
         */
        const vpcStack = await auto.LocalWorkspace.createOrSelectStack({ workDir: vpcWorkDir, stackName });
        vpcStack.setAllConfig({
            "publicKey": { value: publicKey },
        });

        const vpcResult = await vpcStack.up({ onOutput: console.log });
        const vpcOutputs = vpcResult.outputs;

        /**
         * Establish connection to private resources.
         */
        tunnel = startSshTunnel(vpcOutputs.bastionHost?.value, vpcOutputs.dbHost?.value);

        /**
         * Provision database resources - e.g. PostgreSQL databases.
         */
        const dbStack = await auto.LocalWorkspace.createOrSelectStack({ workDir: dbWorkDir, stackName });
        dbStack.setAllConfig({
            "postgresql:host": { value: "localhost" },
            "postgresql:username": { value: vpcOutputs.dbUsername.value, },
            "postgresql:password": { value: vpcOutputs.dbPassword.value, secret: true, },
        });
        const dbResult = await dbStack.up({ onOutput: console.log });
    }
    catch (err: any) {
        console.log(err);
        process.exit(1);
    }
    finally {
        stopSshTunnel(tunnel);
    }
}

/**
 * `refresh` the stacks in the appropriate order:
 * 1. establish private connectivity
 * 2. `refresh` the database resources
 * 3. `refresh` the vpc and rds resources
 */
async function refresh(stackName: string) {
    let tunnel: child_process.ChildProcessWithoutNullStreams | undefined;
    try {
        installDependencies([vpcWorkDir, dbWorkDir]);

        const vpcStack = await auto.LocalWorkspace.selectStack({ workDir: vpcWorkDir, stackName });
        const vpcOutputs = await vpcStack.outputs();

        /**
         * Establish connection to private resources.
         */
        tunnel = startSshTunnel(vpcOutputs.bastionHost?.value, vpcOutputs.dbHost?.value);

        /**
         * Refresh database resources.
         */
        const dbStack = await auto.LocalWorkspace.selectStack({ workDir: dbWorkDir, stackName });
        const dbResult = await dbStack.refresh({ onOutput: console.log });

        /**
         * Refresh VPC, Bastion, and RDS.
         */
        const vpcResult = await vpcStack.refresh({ onOutput: console.log });
    }
    catch (err: any) {
        console.log(err);
        process.exit(1);
    }
    finally {
        stopSshTunnel(tunnel);
    }
}

/**
 * `destroy` the stacks in the appropriate order:
 * 1. establish private connectivity
 * 2. `destroy` the database resources
 * 3. `destroy` the vpc and rds resources
 */
async function destroy(stackName: string) {
    let tunnel: child_process.ChildProcessWithoutNullStreams | undefined;
    try {
        installDependencies([vpcWorkDir, dbWorkDir]);

        const vpcStack = await auto.LocalWorkspace.selectStack({ workDir: vpcWorkDir, stackName });
        const vpcOutputs = await vpcStack.outputs();

        /**
         * Establish connection to private resources.
         */
        tunnel = startSshTunnel(vpcOutputs.bastionHost?.value, vpcOutputs.dbHost?.value);

        /**
         * Destroy database resources.
         */
        const dbStack = await auto.LocalWorkspace.selectStack({ workDir: dbWorkDir, stackName });
        const dbResult = await dbStack.destroy({ onOutput: console.log });

        /**
         * Destroy VPC, Bastion, and RDS.
         */
        const vpcResult = await vpcStack.destroy({ onOutput: console.log });
    }
    catch (err: any) {
        console.log(err);
        process.exit(1);
    }
    finally {
        stopSshTunnel(tunnel);
    }
}

/**
 * Argument handling
 */
if (command === undefined || stackName === undefined) {
    console.log(`command and stack name must be passed as arguments`);
    process.exit(1);
}

if (command === "preview") {
    preview();
}
if (command === "up") {
    const publicKeyFile = fs.readFileSync(publicKeyFilePath).toString();
    console.log(`Running [${command}] on stack [${stackName}]`);
    up(stackName, publicKeyFile);
}
else if (command === "destroy") {
    console.log(`Running [${command}] on stack [${stackName}]`);
    destroy(stackName);
}
else if (command === "refresh") {
    console.log(`Running [${command}] on stack [${stackName}]`);
    refresh(stackName);
}
else {
    console.log(`Unsupported command [${command}]. Exiting...`);
    process.exit(1);
}

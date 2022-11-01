import * as process from "process";
import { RemoteWorkspace, fullyQualifiedStackName } from "@pulumi/pulumi/automation";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("usage: npm run start <org> [destroy]")
    process.exit(1);
}

const org = args[0];
const project = "aws-ts-s3-folder";
const stackName = fullyQualifiedStackName(org, project, "dev");
const awsRegion = "us-west-2";

(async function() {
    const stack = await RemoteWorkspace.createOrSelectStack({
        stackName,
        url: "https://github.com/pulumi/examples.git",
        branch: "refs/heads/master",
        projectPath: project,
    }, {
        envVars: {
            AWS_REGION:            awsRegion,
            AWS_ACCESS_KEY_ID:     process.env.AWS_ACCESS_KEY_ID ?? "",
            AWS_SECRET_ACCESS_KEY: { secret: process.env.AWS_SECRET_ACCESS_KEY ?? "" },
            AWS_SESSION_TOKEN:     { secret: process.env.AWS_SESSION_TOKEN ?? "" },
        },
    });

    const destroy = args.length > 1 && args[1] === "destroy";
    if (destroy) {
        await stack.destroy({ onOutput: console.log });
        console.log("Stack successfully destroyed");
        process.exit(0);
    }

    const upRes = await stack.up({ onOutput: console.log });
    console.log("Update succeeded!");
    console.log(`url: ${upRes.outputs.websiteUrl.value}`);
})();

"use strict";
// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const aws = require("@pulumi/aws");
const docker = require("@pulumi/docker");
const pulumi = require("@pulumi/pulumi");
const utils = require("../utils");
class Image {
    static fromPath(nameOrRepository, path) {
        if (path === undefined) {
            throw new Error("'build' was undefined");
        }
        return new AssetImage(nameOrRepository, path);
    }
    static fromDockerBuild(nameOrRepository, build) {
        if (build === undefined) {
            throw new Error("'path' was undefined");
        }
        return new AssetImage(nameOrRepository, build);
    }
    /**
     * Creates an [Image] given function code to use as the implementation of the container.
     */
    static fromFunction(func) {
        return new FunctionImage(func);
    }
}
exports.Image = Image;
class FunctionImage extends Image {
    constructor(func) {
        super();
        this.func = func;
    }
    image() {
        // TODO[pulumi/pulumi-cloud#85]: move this to a Pulumi Docker Hub account.
        return "lukehoban/nodejsrunner";
    }
    environment() {
        return pulumi.runtime.serializeFunction(this.func).then(value => [{
                name: "PULUMI_SRC",
                value: value.text,
            }]);
    }
}
class AssetImage extends Image {
    constructor(nameOrRepository, pathOrBuild) {
        super();
        this.nameOrRepository = nameOrRepository;
        this.pathOrBuild = pulumi.output(pathOrBuild);
    }
    environment(name, parent) {
        return [];
    }
    image(name, parent) {
        if (!this.imageResult) {
            const repository = typeof this.nameOrRepository === "string"
                ? AssetImage.createRepository(this.nameOrRepository, { parent })
                : this.nameOrRepository;
            const { repositoryUrl, registryId } = repository;
            this.imageResult = pulumi.all([this.pathOrBuild, repositoryUrl, registryId])
                .apply(([pathOrBuild, repositoryUrl, registryId]) => computeImageFromAsset(pathOrBuild, repositoryUrl, registryId, parent));
        }
        return this.imageResult;
    }
    // getOrCreateRepository returns the ECR repository for this image, lazily allocating if necessary.
    static createRepository(name, opts) {
        const repository = new aws.ecr.Repository(name.toLowerCase(), {}, opts);
        // Set a default lifecycle policy such that at most a single untagged image is retained.
        // We tag all cached build layers as well as the final image, so those images will never expire.
        const lifecyclePolicyDocument = {
            rules: [{
                    rulePriority: 10,
                    description: "remove untagged images",
                    selection: {
                        tagStatus: "untagged",
                        countType: "imageCountMoreThan",
                        countNumber: 1,
                    },
                    action: {
                        type: "expire",
                    },
                }],
        };
        const lifecyclePolicy = new aws.ecr.LifecyclePolicy(name.toLowerCase(), {
            policy: JSON.stringify(lifecyclePolicyDocument),
            repository: repository.name,
        }, opts);
        return repository;
    }
}
function getImageName(pathOrBuild) {
    // Produce a hash of the build context and use that for the image name.
    let buildSig;
    if (typeof pathOrBuild === "string") {
        buildSig = pathOrBuild;
    }
    else {
        buildSig = pathOrBuild.context || ".";
        if (pathOrBuild.dockerfile) {
            buildSig += `;dockerfile=${pathOrBuild.dockerfile}`;
        }
        if (pathOrBuild.args) {
            for (const arg of Object.keys(pathOrBuild.args)) {
                buildSig += `;arg[${arg}]=${pathOrBuild.args[arg]}`;
            }
        }
    }
    buildSig += pulumi.getStack();
    return `${utils.sha1hash(buildSig)}-container`;
}
/** @internal */
function computeImageFromAsset(pathOrBuild, repositoryUrl, registryId, parent) {
    pulumi.log.debug(`Building container image at '${JSON.stringify(pathOrBuild)}'`, parent);
    const imageName = getImageName(pathOrBuild);
    // If we haven't, build and push the local build context to the ECR repository.  Then return
    // the unique image name we pushed to.  The name will change if the image changes ensuring
    // the TaskDefinition get's replaced IFF the built image changes.
    const uniqueImageName = docker.buildAndPushImage(imageName, pathOrBuild, repositoryUrl, parent, async () => {
        // Construct Docker registry auth data by getting the short-lived authorizationToken from ECR, and
        // extracting the username/password pair after base64-decoding the token.
        //
        // See: http://docs.aws.amazon.com/cli/latest/reference/ecr/get-authorization-token.html
        if (!registryId) {
            throw new Error("Expected registry ID to be defined during push");
        }
        const credentials = await aws.ecr.getCredentials({ registryId: registryId }, { parent, async: true });
        const decodedCredentials = Buffer.from(credentials.authorizationToken, "base64").toString();
        const [username, password] = decodedCredentials.split(":");
        if (!password || !username) {
            throw new Error("Invalid credentials");
        }
        return {
            registry: credentials.proxyEndpoint,
            username: username,
            password: password,
        };
    });
    uniqueImageName.apply(d => pulumi.log.debug(`    build complete: ${imageName} (${d})`, parent));
    return uniqueImageName;
}
exports.computeImageFromAsset = computeImageFromAsset;
//# sourceMappingURL=image.js.map
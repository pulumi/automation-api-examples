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
const pulumi = require("@pulumi/pulumi");
class InternetGateway extends pulumi.ComponentResource {
    constructor(name, vpc, args, opts = {}) {
        super("awsx:x:ec2:InternetGateway", name, {}, Object.assign({ parent: vpc }, opts));
        this.vpc = vpc;
        if (isExistingInternetGatewayArgs(args)) {
            this.internetGateway = args.internetGateway;
        }
        else {
            this.internetGateway = new aws.ec2.InternetGateway(name, Object.assign(Object.assign({}, args), { vpcId: vpc.id }), { parent: this });
        }
        this.registerOutputs();
    }
    route(name, opts) {
        return {
            // From above: For IPv4 traffic, specify 0.0.0.0/0 in the Destination box, and
            // select the internet gateway ID in the Target list.
            destinationCidrBlock: "0.0.0.0/0",
            gatewayId: this.internetGateway.id,
        };
    }
}
exports.InternetGateway = InternetGateway;
function isExistingInternetGatewayArgs(obj) {
    return !!obj.internetGateway;
}
//# sourceMappingURL=internetGateway.js.map
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
const pulumi = require("@pulumi/pulumi");
const cidr_1 = require("./cidr");
const utils = require("../utils");
function create(resource, vpcName, vpcCidr, ipv6CidrBlock, availabilityZones, numberOfNatGateways, assignGeneratedIpv6CidrBlock, subnetArgsArray) {
    // Check if the subnets were given explicit location information or not.  If so, we'll
    // respect the location information the user asked for.  If not, we'll automatically
    // smartly partition the vpc.
    const firstSubnet = subnetArgsArray[0];
    const hasExplicitLocation = !!firstSubnet.location;
    for (const subnet of subnetArgsArray) {
        const siblingHasLocation = !!subnet.location;
        if (hasExplicitLocation !== siblingHasLocation) {
            throw new pulumi.ResourceError("[location] property must be specified for either no subnets or all of the subnets.", resource);
        }
        if (siblingHasLocation && subnet.cidrMask !== undefined) {
            throw new pulumi.ResourceError("Subnet cannot specify [location] and [cidrMask]", resource);
        }
    }
    const topology = hasExplicitLocation
        ? new ExplicitLocationTopology(resource, vpcName, vpcCidr, ipv6CidrBlock, availabilityZones, numberOfNatGateways, assignGeneratedIpv6CidrBlock)
        : new ComputedLocationTopology(resource, vpcName, vpcCidr, ipv6CidrBlock, availabilityZones, numberOfNatGateways, assignGeneratedIpv6CidrBlock);
    return topology.create(subnetArgsArray);
}
exports.create = create;
/** @internal */
class VpcTopology {
    constructor(resource, vpcName, vpcCidr, ipv6CidrBlock, availabilityZones, numberOfNatGateways, assignGeneratedIpv6CidrBlock) {
        this.resource = resource;
        this.vpcName = vpcName;
        this.ipv6CidrBlock = ipv6CidrBlock;
        this.availabilityZones = availabilityZones;
        this.numberOfNatGateways = numberOfNatGateways;
        this.assignGeneratedIpv6CidrBlock = assignGeneratedIpv6CidrBlock;
        this.vpcCidrBlock = cidr_1.Cidr32Block.fromCidrNotation(vpcCidr);
    }
    shouldCreateNatGateways(publicSubnets, privateSubnets) {
        // To make natgateways:
        // 1. we have to have at least been asked to make some nat gateways.
        // 2. we need public subnets to actually place the nat gateways in.
        // 3. we need private subnets that will actually be connected to the nat gateways.
        return this.numberOfNatGateways > 0 && publicSubnets.length > 0 && privateSubnets.length > 0;
    }
}
class ComputedLocationTopology extends VpcTopology {
    create(subnetArgsArray) {
        const maskedSubnets = subnetArgsArray.filter(s => s.cidrMask !== undefined);
        const unmaskedSubnets = subnetArgsArray.filter(s => s.cidrMask === undefined);
        const subnetDescriptions = [];
        const natGateways = [];
        const natRoutes = [];
        // First, break up the available vpc cidr block to each subnet based on the amount of space
        // they request.
        for (const subnetArgs of maskedSubnets) {
            subnetDescriptions.push(...this.createSubnetsWorker(subnetArgs, subnetArgs.cidrMask, subnetDescriptions.length));
        }
        // Then, take the remaining subnets can break the remaining space up to them.
        const cidrMaskForUnmaskedSubnets = this.computeCidrMaskForSubnets(unmaskedSubnets, unmaskedSubnets.length > 0);
        for (const subnetArgs of unmaskedSubnets) {
            subnetDescriptions.push(...this.createSubnetsWorker(subnetArgs, cidrMaskForUnmaskedSubnets, subnetDescriptions.length));
        }
        const publicSubnets = subnetDescriptions.filter(d => d.type === "public");
        const privateSubnets = subnetDescriptions.filter(d => d.type === "private");
        // Create nat gateways if we have private subnets and we have public subnets to place them in.
        if (this.shouldCreateNatGateways(publicSubnets, privateSubnets)) {
            const numberOfAvailabilityZones = this.availabilityZones.length;
            if (this.numberOfNatGateways > numberOfAvailabilityZones) {
                throw new Error(`[numberOfNatGateways] cannot be greater than [numberOfAvailabilityZones]: ${this.numberOfNatGateways} > ${numberOfAvailabilityZones}`);
            }
            for (let i = 0; i < this.numberOfNatGateways; i++) {
                // Each public subnet was already created across all availability zones.  So, to
                // maximize coverage of availability zones, we can just walk the public subnets and
                // create a nat gateway for it's availability zone.  If more natgateways were
                // requested then we'll just round-robin them among the availability zones.
                // this indexing is safe since we would have created the any subnet across all
                // availability zones.
                const publicSubnetIndex = i % numberOfAvailabilityZones;
                natGateways.push({
                    name: `${this.vpcName}-${i}`,
                    publicSubnet: publicSubnets[publicSubnetIndex].subnetName,
                });
            }
            let roundRobinIndex = 0;
            // We created subnets 'numberOfAvailabilityZones' at a time.  So just jump through them in
            // chunks of that size.
            for (let i = 0, n = privateSubnets.length; i < n; i += numberOfAvailabilityZones) {
                // For each chunk of subnets, we will have spread them across all the availability
                // zones.  We also created a nat gateway per availability zone *up to*
                // numberOfNatGateways.  So for the subnets in an availability zone that we created a
                // nat gateway in, just route to that nat gateway.  For the other subnets that are
                // in an availability zone without a nat gateway, we just round-robin between any
                // nat gateway we created.
                for (let j = 0; j < numberOfAvailabilityZones; j++) {
                    const privateSubnetIndex = i + j;
                    const natGatewayIndex = j < this.numberOfNatGateways
                        ? j
                        : (roundRobinIndex++ % natGateways.length);
                    natRoutes.push({
                        name: `nat-${j}`,
                        privateSubnet: privateSubnets[privateSubnetIndex].subnetName,
                        natGateway: natGateways[natGatewayIndex].name,
                    });
                }
            }
        }
        return { subnets: subnetDescriptions, natGateways, natRoutes };
    }
    computeCidrMaskForSubnets(subnets, checkResult) {
        // We need one cidr block for each of these subnets in each availability zone.
        const requiredCidrBlockCount = subnets.length * this.availabilityZones.length;
        const firstAvailableIp = this.getNextCidrBlockStartingAddress();
        const availableIps = this.vpcCidrBlock.endIpAddressExclusive - firstAvailableIp;
        const ipsPerBlock = Math.floor(availableIps / requiredCidrBlockCount);
        // ipsPerBlock is going to be some random integer.  However, we need to get the number of
        // mask bits that corresponds to the closest power of 2 that is smaller.  for example If we
        // can split the remaining space into 300 ips per block, then we need to actually only
        // allocate 256 ips per block.  If we were to allocate 512, we'd run out of space.  So
        // we get the log base 2, and round down so that we get 8 in this case.
        //
        // However, that value corresponds to the trailing mask bits, whereas we want the leading
        // bits.  So take that value and subtract from 32 to get the final amount we need.
        const result = 32 - Math.floor(Math.log2(ipsPerBlock));
        if (checkResult) {
            if (result > 28) {
                // subnets cannot be this small as per: https://aws.amazon.com/vpc/faqs/ The minimum
                // size of a subnet is a /28 (or 14 IP addresses.) for IPv4. Subnets cannot be
                // larger than the VPC in which they are created.
                throw new Error(`Not enough address space in VPC to create desired subnet config.
VPC has ${availableIps} IPs, but is being asked to split into a total of ${requiredCidrBlockCount} subnets.
${requiredCidrBlockCount} subnets are necessary to have ${this.availabilityZones.length} AZ(s) each with ${subnets.length} subnet(s) in them.
This needs ${ipsPerBlock} IPs/subnet, which is smaller than the minimum (16) allowed by AWS.`);
            }
        }
        return result;
    }
    getNextCidrBlockStartingAddress() {
        // If we are allocating our first subnet block.  It starts where our vpc cidr block starts.
        // Otherwise, it will start where our last block ends.
        return !this.lastAllocatedSubnetCidrBlock
            ? this.vpcCidrBlock.startIpAddressInclusive
            : this.lastAllocatedSubnetCidrBlock.endIpAddressExclusive;
    }
    assignNextAvailableCidrBlock(mask) {
        // If we are allocating our first subnet block.  It starts where our vpc cidr block starts.
        // Otherwise, it will start where our last block ends.
        const nextStartIpAddressInclusive = this.getNextCidrBlockStartingAddress();
        const nextCidrBlock = new cidr_1.Cidr32Block(nextStartIpAddressInclusive, mask);
        // Make sure this latest block doesn't go past the end of the cidr block of the vpc.
        if (nextCidrBlock.endIpAddressExclusive > this.vpcCidrBlock.endIpAddressExclusive) {
            const lastAllocatedIpAddress = cidr_1.getIPv4Address(nextCidrBlock.endIpAddressExclusive);
            const lastVpcIpAddress = cidr_1.getIPv4Address(this.vpcCidrBlock.endIpAddressExclusive);
            throw new Error(`Subnet cidr block end ip address extends past that last legal ip address for the vpc.
${lastAllocatedIpAddress} > ${lastVpcIpAddress}`);
        }
        this.lastAllocatedSubnetCidrBlock = nextCidrBlock;
        return nextCidrBlock;
    }
    createSubnetsWorker(subnetArgs, cidrMask, currentSubnetIndex) {
        if (cidrMask < 16 || cidrMask > 28) {
            throw new Error(`Cidr mask must be between "16" and "28" but was ${cidrMask}`);
        }
        const result = [];
        const type = subnetArgs.type;
        for (let i = 0; i < this.availabilityZones.length; i++) {
            const subnetName = getSubnetName(this.vpcName, subnetArgs, i);
            const assignIpv6AddressOnCreation = utils.ifUndefined(subnetArgs.assignIpv6AddressOnCreation, this.assignGeneratedIpv6CidrBlock);
            const ipv6CidrBlock = this.createIpv6CidrBlock(assignIpv6AddressOnCreation, currentSubnetIndex++);
            result.push({
                type,
                subnetName,
                args: {
                    availabilityZone: this.availabilityZones[i].name,
                    availabilityZoneId: this.availabilityZones[i].id,
                    cidrBlock: this.assignNextAvailableCidrBlock(cidrMask).toString(),
                    ipv6CidrBlock,
                    // Allow the individual subnet to decide if it wants to be mapped.  If not
                    // specified, default to mapping a public-ip open if the type is 'public', and
                    // not mapping otherwise.
                    mapPublicIpOnLaunch: utils.ifUndefined(subnetArgs.mapPublicIpOnLaunch, type === "public"),
                    assignIpv6AddressOnCreation,
                    tags: subnetArgs.tags,
                },
                ignoreChanges: subnetArgs.ignoreChanges,
            });
        }
        return result;
        function getSubnetName(vpcName, subnetArgs, i) {
            let subnetName = `${subnetArgs.type}-${i}`;
            if (subnetArgs.name) {
                subnetName = `${subnetArgs.name}-` + subnetName;
            }
            return `${vpcName}-${subnetName}`;
        }
    }
    createIpv6CidrBlock(assignIpv6AddressOnCreation, index) {
        const result = pulumi.all([this.ipv6CidrBlock, assignIpv6AddressOnCreation])
            .apply(([vpcIpv6CidrBlock, assignIpv6AddressOnCreation]) => {
            if (!assignIpv6AddressOnCreation) {
                return undefined;
            }
            if (!vpcIpv6CidrBlock) {
                throw new pulumi.ResourceError("Must set [assignGeneratedIpv6CidrBlock] to true on [Vpc] in order to assign ipv6 address to subnet.", this.resource);
            }
            // Should be of the form: 2600:1f16:110:2600::/56
            const colonColonIndex = vpcIpv6CidrBlock.indexOf("::");
            if (colonColonIndex < 0 ||
                vpcIpv6CidrBlock.substr(colonColonIndex) !== "::/56") {
                throw new pulumi.ResourceError(`Vpc ipv6 cidr block was not in an expected form: ${vpcIpv6CidrBlock}`, this.resource);
            }
            const header = vpcIpv6CidrBlock.substr(0, colonColonIndex);
            if (!header.endsWith("00")) {
                throw new pulumi.ResourceError(`Vpc ipv6 cidr block was not in an expected form: ${vpcIpv6CidrBlock}`, this.resource);
            }
            // trim off the 00, and then add 00, 01, 02, 03, etc.
            const prefix = header.substr(0, header.length - 2);
            return prefix + index.toString().padStart(2, "0") + "::/64";
        });
        return result;
    }
}
class ExplicitLocationTopology extends VpcTopology {
    create(subnets) {
        const subnetDescriptions = [];
        const natGateways = [];
        const natRoutes = [];
        if (subnets.length > 0) {
            const azToPublicSubnets = new Map();
            const azToPrivateSubnets = new Map();
            for (let i = 0, n = subnets.length; i < n; i++) {
                const subnetArgs = subnets[i];
                const location = typeof subnetArgs.location === "string"
                    ? { cidrBlock: subnetArgs.location }
                    : subnetArgs.location;
                const type = subnetArgs.type;
                const subnetName = subnetArgs.name || `${type}-${i}`;
                const subnetDesc = {
                    subnetName,
                    type,
                    args: Object.assign(Object.assign({}, location), { 
                        // Allow the individual subnet to decide if it wants to be mapped.  If not
                        // specified, default to mapping a public-ip open if the type is 'public', and
                        // not mapping otherwise.
                        mapPublicIpOnLaunch: utils.ifUndefined(subnetArgs.mapPublicIpOnLaunch, type === "public"), assignIpv6AddressOnCreation: utils.ifUndefined(subnetArgs.assignIpv6AddressOnCreation, this.assignGeneratedIpv6CidrBlock), tags: subnetArgs.tags }),
                    ignoreChanges: subnetArgs.ignoreChanges,
                };
                subnetDescriptions.push(subnetDesc);
                const az = location.availabilityZone || location.availabilityZoneId;
                const specificSubnetMap = type === "public" ? azToPublicSubnets :
                    type === "private" ? azToPrivateSubnets : undefined;
                if (specificSubnetMap) {
                    const specificSubnets = specificSubnetMap.get(az) || [];
                    specificSubnets.push(subnetDesc);
                    specificSubnetMap.set(az, specificSubnets);
                }
            }
            const publicSubnets = subnetDescriptions.filter(d => d.type === "public");
            const privateSubnets = subnetDescriptions.filter(d => d.type === "private");
            if (this.shouldCreateNatGateways(publicSubnets, privateSubnets)) {
                // Create nat gateways for our private subnets.  First, collect the azs the private subnets
                // are in. We'll try to ensure an actual nat gateway in those azs (which is only possible if
                // we have a public subnet in that az).  If there is no public subnet in that az, then just
                // pick another public subnet and place the gateway there.
                const azToNatGateway = new Map();
                // process AZs in sorted order.  That way we always do things in the same order across
                // runs.
                const privateSubnetAzs = [...azToPrivateSubnets.keys()].sort();
                const minNatGateways = Math.min(privateSubnetAzs.length, this.numberOfNatGateways);
                const publicSubnetsWithNatGateway = new Set();
                for (let i = 0; i < minNatGateways; i++) {
                    const az = privateSubnetAzs[i];
                    // try to make a nat gateway in a public subnet in that az.  If we don't have any public
                    // subnets in that az, use a public subnet from another az.  It's not ideal, but it can
                    // at least route things.
                    let publicSubnetForAz;
                    if (azToPublicSubnets.has(az)) {
                        // ok, we've got a public subnet for this az.  Just place hte natgateway in
                        // the first public subnet in that az.
                        publicSubnetForAz = azToPublicSubnets.get(az)[0];
                    }
                    else {
                        // ok, we don't have a public subnet in this az.  Try to pick from any other
                        // public subnet in an az that doesn't currently have a nat gateway.
                        for (const [_, publicSubnetsForOtherAz] of azToPublicSubnets) {
                            if (!publicSubnetsWithNatGateway.has(publicSubnetsForOtherAz[0])) {
                                publicSubnetForAz = publicSubnetsForOtherAz[0];
                                break;
                            }
                        }
                    }
                    if (!publicSubnetForAz) {
                        // no free public subnet
                        continue;
                    }
                    publicSubnetsWithNatGateway.add(publicSubnetForAz);
                    const natGateway = { name: `${this.vpcName}-${i}`, publicSubnet: publicSubnetForAz.subnetName };
                    azToNatGateway.set(az, natGateway);
                    natGateways.push(natGateway);
                }
                // Now, go through every private subnet.  Make a natgateway route for it.  Try to pick
                // a natgateway from it's az.  Otherwise, pick some available natgateway otherwise.
                let natGatewayRoundRobinIndex = 0;
                let routeIndex = 0;
                for (const az of privateSubnetAzs) {
                    const privateSubnetsInAz = azToPrivateSubnets.get(az);
                    const natGatewayInAz = azToNatGateway.get(az);
                    for (let i = 0, n = privateSubnetsInAz.length; i < n; i++) {
                        const privateSubnet = privateSubnetsInAz[i];
                        // If we have a nat gateway in this az, then use it. Otherwise, round robin
                        // through all the nat gateways.
                        const natGateway = natGatewayInAz
                            ? natGatewayInAz
                            : natGateways[natGatewayRoundRobinIndex++ % natGateways.length];
                        natRoutes.push({
                            name: `nat-${routeIndex++}`,
                            privateSubnet: privateSubnet.subnetName,
                            natGateway: natGateway.name,
                        });
                    }
                }
            }
        }
        return { subnets: subnetDescriptions, natGateways, natRoutes };
    }
}
//# sourceMappingURL=vpcTopology.js.map
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
const crypto = require("crypto");
/** @internal */
function Capture(t) {
    return t;
}
exports.Capture = Capture;
// sha1hash returns a partial SHA1 hash of the input string.
/** @internal */
function sha1hash(s) {
    const shasum = crypto.createHash("sha1");
    shasum.update(s);
    // TODO[pulumi/pulumi#377] Workaround for issue with long names not generating per-deplioyment randomness, leading
    //     to collisions.  For now, limit the size of hashes to ensure we generate shorter/ resource names.
    return shasum.digest("hex").substring(0, 8);
}
exports.sha1hash = sha1hash;
/** @internal */
function combineArrays(e1, e2) {
    const result = pulumi.all([e1, e2]).apply(([e1, e2]) => {
        e1 = e1 || [];
        e2 = e2 || [];
        return [...e1, ...e2];
    });
    return result;
}
exports.combineArrays = combineArrays;
/** @internal */
function ifUndefined(input, value) {
    return pulumi.all([input, value])
        .apply(([input, value]) => input !== undefined ? input : value);
}
exports.ifUndefined = ifUndefined;
/** @internal */
function checkCompat() {
    return undefined;
}
exports.checkCompat = checkCompat;
/** @internal */
function mergeTags(tags1, tags2) {
    return pulumi.all([tags1, tags2]).apply(([tags1, tags2]) => (Object.assign(Object.assign({}, (tags1 || {})), (tags2 || {}))));
}
exports.mergeTags = mergeTags;
/**
 * Common code for doing RTTI typechecks.  RTTI is done by having a boolean property on an object
 * with a special name (like "__resource" or "__asset").  This function checks that the object
 * exists, has a **boolean** property with that name, and that that boolean property has the value
 * of 'true'.  Checking that property is 'boolean' helps ensure that this test works even on proxies
 * that synthesize properties dynamically (like Output).  Checking that the property has the 'true'
 * value isn't strictly necessary, but works to make sure that the impls are following a common
 * pattern.
 */
/** @internal */
function isInstance(obj, name) {
    return hasTrueBooleanMember(obj, name);
}
exports.isInstance = isInstance;
/** @internal */
function hasTrueBooleanMember(obj, memberName) {
    if (obj === undefined || obj === null) {
        return false;
    }
    const val = obj[memberName];
    if (typeof val !== "boolean") {
        return false;
    }
    return val === true;
}
exports.hasTrueBooleanMember = hasTrueBooleanMember;
/** @internal */
function getRegionFromOpts(opts) {
    if (opts.parent) {
        return getRegion(opts.parent);
    }
    return getRegionFromProvider(opts.provider);
}
exports.getRegionFromOpts = getRegionFromOpts;
/** @internal */
function getRegion(res) {
    // A little strange, but all we're doing is passing a fake type-token simply to get
    // the AWS provider from this resource.
    const provider = res.getProvider ? res.getProvider("aws::") : undefined;
    return getRegionFromProvider(provider);
}
exports.getRegion = getRegion;
function getRegionFromProvider(provider) {
    const region = provider ? provider.region : undefined;
    return region || aws.config.region;
}
//# sourceMappingURL=utils.js.map
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
function getImageNameAndTag(baseImageName) {
    // From https://docs.docker.com/engine/reference/commandline/tag
    //
    // "A tag name must be valid ASCII and may contain lowercase and uppercase letters, digits,
    // underscores, periods and dashes. A tag name may not start with a period or a dash and may
    // contain a maximum of 128 characters."
    //
    // So it is safe for us to just look for the colon, and consume whatever follows as the tag
    // for the image.
    const lastColon = baseImageName.lastIndexOf(":");
    const imageName = lastColon < 0 ? baseImageName : baseImageName.substr(0, lastColon);
    const tag = lastColon < 0 ? undefined : baseImageName.substr(lastColon + 1);
    return { imageName, tag };
}
exports.getImageNameAndTag = getImageNameAndTag;
//# sourceMappingURL=utils.js.map
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
/**
 * getCognitoAuthorizer is a helper function to generate a CognitoAuthorizer.
 * @param name - the name for the authorizer. This must be unique for each unique authorizer in the API.
 * @param args - configuration information for the Cognito Authorizer.
 */
function getCognitoAuthorizer(args) {
    const parameterName = args.header || "Authorization";
    return {
        authorizerName: args.authorizerName,
        parameterName: parameterName,
        providerARNs: args.providerARNs,
        identitySource: ["method.request.header." + parameterName],
        identityValidationExpression: args.identityValidationExpression,
        authorizerResultTtlInSeconds: args.authorizerResultTtlInSeconds,
        methodsToAuthorize: args.methodsToAuthorize,
    };
}
exports.getCognitoAuthorizer = getCognitoAuthorizer;
//# sourceMappingURL=cognitoAuthorizer.js.map
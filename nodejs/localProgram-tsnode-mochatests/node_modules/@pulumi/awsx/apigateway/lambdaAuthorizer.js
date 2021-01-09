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
// These APIs are currently experimental and may change.
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
/** @internal */
function isLambdaAuthorizer(authorizer) {
    return authorizer.handler !== undefined;
}
exports.isLambdaAuthorizer = isLambdaAuthorizer;
/** @internal */
function isLambdaAuthorizerInfo(info) {
    return info.uri !== undefined;
}
exports.isLambdaAuthorizerInfo = isLambdaAuthorizerInfo;
/** @internal */
function getIdentitySource(identitySources) {
    if (identitySources) {
        return identitySources.join(", ");
    }
    return "";
}
exports.getIdentitySource = getIdentitySource;
/** @internal */
function createRoleWithAuthorizerInvocationPolicy(authorizerName, authorizerLambda, opts) {
    const policy = aws.iam.assumeRolePolicyForPrincipal({ "Service": ["lambda.amazonaws.com", "apigateway.amazonaws.com"] });
    // We previously didn't parent the Role or RolePolicy to anything.  Now we do.  Pass an
    // appropriate alias to prevent resources from being destroyed/created.
    const role = new aws.iam.Role(authorizerName + "-authorizer-role", {
        assumeRolePolicy: JSON.stringify(policy),
    }, pulumi.mergeOptions(opts, { aliases: [{ parent: pulumi.rootStackResource }] }));
    // Add invocation policy to lambda role
    const invocationPolicy = new aws.iam.RolePolicy(authorizerName + "-invocation-policy", {
        policy: pulumi.interpolate `{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "lambda:InvokeFunction",
                        "Effect": "Allow",
                        "Resource": "${authorizerLambda.arn}"
                    }
                ]
            }`,
        role: role.id,
    }, pulumi.mergeOptions(opts, { aliases: [{ parent: pulumi.rootStackResource }] }));
    return role;
}
exports.createRoleWithAuthorizerInvocationPolicy = createRoleWithAuthorizerInvocationPolicy;
/**
 * Simplifies creating an AuthorizerResponse.
 *
 * @param principalId - unique identifier for the user
 * @param effect - whether to "Allow" or "Deny" the request
 * @param resource - the API method to be invoked (typically event.methodArn)
 * @param context - key-value pairs that are passed from the authorizer to the backend Lambda
 * @param apiKey - if the API uses a usage plan, this must be set to one of the usage plan's API keys
 */
function authorizerResponse(principalId, effect, resource, context, apiKey) {
    const response = {
        principalId: principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [{
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource,
                }],
        },
    };
    response.context = context;
    response.usageIdentifierKey = apiKey;
    return response;
}
exports.authorizerResponse = authorizerResponse;
/**
 * getTokenLambdaAuthorizer is a helper function to generate a token LambdaAuthorizer.
 * @param name - the name for the authorizer. This must be unique for each unique authorizer in the API.
 * @param args - configuration information for the token Lambda.
 */
function getTokenLambdaAuthorizer(args) {
    return {
        authorizerName: args.authorizerName,
        parameterName: args.header || "Authorization",
        parameterLocation: "header",
        authType: "oauth2",
        type: "token",
        handler: args.handler,
        identityValidationExpression: args.identityValidationExpression,
        authorizerResultTtlInSeconds: args.authorizerResultTtlInSeconds,
    };
}
exports.getTokenLambdaAuthorizer = getTokenLambdaAuthorizer;
/**
 * getRequestLambdaAuthorizer is a helper function to generate a request LambdaAuthorizer.
 *
 * @param name - the name for the authorizer. This must be unique for each unique authorizer in the
 * API.
 * @param args - configuration information for the token Lambda.
 */
function getRequestLambdaAuthorizer(args) {
    let parameterName;
    let location;
    const numQueryParams = getLength(args.queryParameters);
    const numHeaders = getLength(args.headers);
    if (numQueryParams === 0 && numHeaders === 0) {
        throw new Error("[args.queryParameters] and [args.headers] were both empty. At least one query parameter or header must be specified");
    }
    else {
        location = getLocation(numHeaders, numQueryParams);
        parameterName = getParameterName(args, numHeaders, numQueryParams);
    }
    return {
        authorizerName: args.authorizerName,
        parameterName: parameterName,
        parameterLocation: location,
        authType: "custom",
        type: "request",
        handler: args.handler,
        identitySource: parametersToIdentitySources(args),
        authorizerResultTtlInSeconds: args.authorizerResultTtlInSeconds,
    };
}
exports.getRequestLambdaAuthorizer = getRequestLambdaAuthorizer;
/** @internal */
function getLength(params) {
    if (!params) {
        return 0;
    }
    return params.length;
}
/** @internal */
function getParameterName(args, numHeaders, numQueryParameters) {
    if (numQueryParameters + numHeaders === 1) {
        if (args.queryParameters) {
            return args.queryParameters[0];
        }
        else if (args.headers) {
            return args.headers[0];
        }
    }
    return "Unused";
}
/** @internal */
function getLocation(numHeaders, numQueryParameters) {
    if (numHeaders > 0) {
        return "header";
    }
    else if (numQueryParameters > 0) {
        return "query";
    }
    else {
        throw new Error("Could not determine parameter location");
    }
}
/** @internal */
function parametersToIdentitySources(args) {
    const identitySource = [];
    if (args.headers) {
        for (const header of args.headers) {
            identitySource.push("method.request.header." + header);
        }
    }
    if (args.queryParameters) {
        for (const param of args.queryParameters) {
            identitySource.push("method.request.querystring." + param);
        }
    }
    return identitySource;
}
//# sourceMappingURL=lambdaAuthorizer.js.map
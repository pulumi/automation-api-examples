import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
/**
 * CognitoAuthorizer provides the definition for a Cognito User Pools Authorizer for API Gateway.
 */
export interface CognitoAuthorizer {
    /**
     * The name for the Authorizer to be referenced as. This must be unique for each unique
     * authorizer within the API. If no name if specified, a name will be generated for you.
     */
    authorizerName?: string;
    /**
     * parameterName is the name of the header containing the authorization token.
     */
    parameterName: string;
    /**
     * The ARNs of the Cognito User Pools to use.
     */
    providerARNs: (pulumi.Input<string> | aws.cognito.UserPool)[];
    /**
     * List containing the request header that holds the authorization token. Example: if the token
     * header is `Auth` the identity source would be ["method.request.header.Auth"]
     */
    identitySource: string[];
    /**
     * A regular expression for validating the token as the incoming identity. It only invokes the
     * authorizer if there is a match, else it will return a 401. Example: "^x-[a-z]+"
     */
    identityValidationExpression?: string;
    /**
     * The number of seconds during which the resulting IAM policy is cached. Default is 300s. You
     * can set this value to 0 to disable caching. Max value is 3600s. Note - if you are sharing an
     * authorizer across more than one route you will want to disable the cache or else it will
     * cause problems for you.
     */
    authorizerResultTtlInSeconds?: number;
    /**
     * For method authorization, you can define resource servers and custom scopes by specifying the
     * "resource-server/scope". e.g. ["com.hamuta.movies/drama.view",
     * "http://my.resource.com/file.read"] For more information on resource servers and custom
     * scopes visit the AWS documentation -
     * https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html
     */
    methodsToAuthorize?: string[];
}
/**
 * The set of arguments for constructing a CognitoAuthorizer resource.
 */
export interface CognitoAuthorizerArgs {
    /**
     * The name for the Authorizer to be referenced as. This must be unique for each unique
     * authorizer within the API. If no name if specified, a name will be generated for you.
     */
    authorizerName?: string;
    /**
     * The request header for the authorization token. If not set, this defaults to
     * "Authorization".
     */
    header?: string;
    /**
     * The ARNs of the Cognito User Pools to use.
     */
    providerARNs: (pulumi.Input<string> | aws.cognito.UserPool)[];
    /**
     * A regular expression for validating the token as the incoming identity. It only invokes the
     * authorizer if there is a match, else it will return a 401. Example: "^x-[a-z]+"
     */
    identityValidationExpression?: string;
    /**
     * The number of seconds during which the resulting IAM policy is cached. Default is 300s. You
     * can set this value to 0 to disable caching. Max value is 3600s. Note - if you are sharing an
     * authorizer across more than one route you will want to disable the cache or else it will
     * cause problems for you.
     */
    authorizerResultTtlInSeconds?: number;
    /**
     * For method authorization, you can define resource servers and custom scopes by specifying the
     * "resource-server/scope". e.g. ["com.hamuta.movies/drama.view",
     * "http://my.resource.com/file.read"] For more information on resource servers and custom
     * scopes visit the AWS documentation -
     * https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html
     */
    methodsToAuthorize?: string[];
}
/**
 * getCognitoAuthorizer is a helper function to generate a CognitoAuthorizer.
 * @param name - the name for the authorizer. This must be unique for each unique authorizer in the API.
 * @param args - configuration information for the Cognito Authorizer.
 */
export declare function getCognitoAuthorizer(args: CognitoAuthorizerArgs): CognitoAuthorizer;

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as awslambda from "aws-lambda";
export declare type AuthorizerEvent = awslambda.CustomAuthorizerEvent;
export declare type AuthorizerResponse = awslambda.CustomAuthorizerResult;
export declare type AuthResponseContext = awslambda.AuthResponseContext;
/**
 * LambdaAuthorizer provides the definition for a custom Authorizer for API Gateway.
 */
export interface LambdaAuthorizer {
    /**
     * The name for the Authorizer to be referenced as. This must be unique for each unique
     * authorizer within the API. If no name if specified, a name will be generated for you.
     */
    authorizerName?: string;
    /**
     * parameterName is the name of the header or query parameter containing the authorization
     * token. Must be "Unused" for multiple identity sources.
     * */
    parameterName: string;
    /**
     * Defines where in the request API Gateway should look for identity information. The value must
     * be "header" or "query". If there are multiple identity sources, the value must be "header".
     */
    parameterLocation: "header" | "query";
    /**
     * Specifies the authorization mechanism for the client. Typical values are "oauth2" or "custom".
     */
    authType: string;
    /**
     * The type of the authorizer. This value must be one of the following:
     *      - "token", for an authorizer with the caller identity embedded in an authorization token
     *      - "request", for an authorizer with the caller identity contained in request parameters
     */
    type: "token" | "request";
    /**
     * The authorizerHandler specifies information about the authorizing Lambda. You can either set
     * up the Lambda separately and just provide the required information or you can define the
     * Lambda inline using a JavaScript function.
     */
    handler: LambdaAuthorizerInfo | aws.lambda.EventHandler<AuthorizerEvent, AuthorizerResponse>;
    /**
     * List of mapping expressions of the request parameters as the identity source. This indicates
     * where in the request identity information is expected. Applicable for the authorizer of the
     * "request" type only. Example: ["method.request.header.HeaderAuth1",
     * "method.request.querystring.QueryString1"]
     */
    identitySource?: string[];
    /**
     * A regular expression for validating the token as the incoming identity. It only invokes the
     * authorizer's lambda if there is a match, else it will return a 401. This does not apply to
     * REQUEST Lambda Authorizers. Example: "^x-[a-z]+"
     */
    identityValidationExpression?: string;
    /**
     * The number of seconds during which the resulting IAM policy is cached. Default is 300s. You
     * can set this value to 0 to disable caching. Max value is 3600s. Note - if you are sharing an
     * authorizer across more than one route you will want to disable the cache or else it will
     * cause problems for you.
     */
    authorizerResultTtlInSeconds?: number;
}
export interface LambdaAuthorizerInfo {
    /**
     * The Uniform Resource Identifier (URI) of the authorizer Lambda function. The Lambda may also
     * be passed directly, in which cases the URI will be obtained for you.
     */
    uri: pulumi.Input<string> | aws.lambda.Function;
    /**
     * Credentials required for invoking the authorizer in the form of an ARN of an IAM execution role.
     * For example, "arn:aws:iam::account-id:IAM_role".
     */
    credentials: pulumi.Input<string> | aws.iam.Role;
}
/**
 * Simplifies creating an AuthorizerResponse.
 *
 * @param principalId - unique identifier for the user
 * @param effect - whether to "Allow" or "Deny" the request
 * @param resource - the API method to be invoked (typically event.methodArn)
 * @param context - key-value pairs that are passed from the authorizer to the backend Lambda
 * @param apiKey - if the API uses a usage plan, this must be set to one of the usage plan's API keys
 */
export declare function authorizerResponse(principalId: string, effect: Effect, resource: string, context?: AuthResponseContext, apiKey?: string): AuthorizerResponse;
export declare type Effect = "Allow" | "Deny";
/**
 * The set of arguments for constructing a token LambdaAuthorizer resource.
 */
export interface TokenAuthorizerArgs {
    /**
     * The name for the Authorizer to be referenced as. This must be unique for each unique
     * authorizer within the API. If no name if specified, a name will be generated for you.
     */
    authorizerName?: string;
    /**
     * The request header for the authorization token. If not set, this defaults to
     * Authorization.
     */
    header?: string;
    /**
     * The authorizerHandler specifies information about the authorizing Lambda. You can either set
     * up the Lambda separately and just provide the required information or you can define the
     * Lambda inline using a JavaScript function.
     */
    handler: LambdaAuthorizerInfo | aws.lambda.EventHandler<AuthorizerEvent, AuthorizerResponse>;
    /**
     * A regular expression for validating the token as the incoming identity.
     * Example: "^x-[a-z]+"
     */
    identityValidationExpression?: string;
    /**
     * The number of seconds during which the resulting IAM policy is cached. Default is 300s. You
     * can set this value to 0 to disable caching. Max value is 3600s. Note - if you are sharing an
     * authorizer across more than one route you will want to disable the cache or else it will
     * cause problems for you.
     */
    authorizerResultTtlInSeconds?: number;
}
/**
 * getTokenLambdaAuthorizer is a helper function to generate a token LambdaAuthorizer.
 * @param name - the name for the authorizer. This must be unique for each unique authorizer in the API.
 * @param args - configuration information for the token Lambda.
 */
export declare function getTokenLambdaAuthorizer(args: TokenAuthorizerArgs): LambdaAuthorizer;
/**
 * The set of arguments for constructing a request LambdaAuthorizer resource.
 */
export interface RequestAuthorizerArgs {
    /**
     * The name for the Authorizer to be referenced as. This must be unique for each unique authorizer
     * within the API. If no name if specified, a name will be generated for you.
     */
    authorizerName?: string;
    /**
     * queryParameters is an array of the expected query parameter keys used to authorize a request.
     * While this argument is optional, at least one queryParameter or one header must be defined.
     * */
    queryParameters?: string[];
    /**
     * headers is an array of the expected header keys used to authorize a request.
     *  While this argument is optional, at least one queryParameter or one header must be defined.
     * */
    headers?: string[];
    /**
     * The authorizerHandler specifies information about the authorizing Lambda. You can either set
     * up the Lambda separately and just provide the required information or you can define the
     * Lambda inline using a JavaScript function.
     */
    handler: LambdaAuthorizerInfo | aws.lambda.EventHandler<AuthorizerEvent, AuthorizerResponse>;
    /**
     * The number of seconds during which the resulting IAM policy is cached. Default is 300s. You
     * can set this value to 0 to disable caching. Max value is 3600s. Note - if you are sharing an
     * authorizer across more than one route you will want to disable the cache or else it will
     * cause problems for you.
     */
    authorizerResultTtlInSeconds?: number;
}
/**
 * getRequestLambdaAuthorizer is a helper function to generate a request LambdaAuthorizer.
 *
 * @param name - the name for the authorizer. This must be unique for each unique authorizer in the
 * API.
 * @param args - configuration information for the token Lambda.
 */
export declare function getRequestLambdaAuthorizer(args: RequestAuthorizerArgs): LambdaAuthorizer;

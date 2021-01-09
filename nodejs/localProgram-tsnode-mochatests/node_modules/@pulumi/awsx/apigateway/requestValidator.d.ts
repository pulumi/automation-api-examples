/** Parameter is used to define required path, query or header parameters for
 * API Gateway. If "ALL" or "PARAMS_ONLY" validator is set then, api gateway
 * will validate the parameter is included and non-blank for incoming requests.
*/
export interface Parameter {
    name: string;
    /**
     * in is where the parameter is expected to appear. API Gateway can validate
     * parameters expected in the path, query or header.
     */
    in: "path" | "query" | "header";
}

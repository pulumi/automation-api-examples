package com.pulumi;

import com.pulumi.aws.s3.inputs.BucketOwnershipControlsRuleArgs;
import com.pulumi.experimental.automation.*;
import com.pulumi.aws.s3.BucketV2;
import com.pulumi.aws.s3.BucketObject;
import com.pulumi.aws.s3.BucketObjectArgs;
import com.pulumi.aws.s3.BucketWebsiteConfigurationV2;
import com.pulumi.aws.s3.BucketWebsiteConfigurationV2Args;
import com.pulumi.aws.s3.inputs.BucketWebsiteConfigurationV2IndexDocumentArgs;
import com.pulumi.aws.s3.BucketOwnershipControls;
import com.pulumi.aws.s3.BucketOwnershipControlsArgs;
import com.pulumi.aws.s3.BucketPublicAccessBlock;
import com.pulumi.aws.s3.BucketPublicAccessBlockArgs;
import com.pulumi.resources.CustomResourceOptions;
import java.nio.file.Paths;

public class App {
    public static void main(String[] args) {
        // var projectName = "inline_s3_project_java";
        var stackName = "dev";
        var workingDir = Paths.get("..", "website");

        var destroy = args.length > 0 && args[0].equals("destroy");
        try {
            var stack = LocalWorkspace.createOrSelectStack(stackName, workingDir);

            System.out.println("Successfully initialized stack");

            // // Install required Pulumi plugins
            // System.out.println("Installing plugins...");
            // stack.getWorkspace().installPlugin("aws", "v5.41.0");
            // System.out.println("Plugins installed");

            // Set AWS region
            System.out.println("Setting up config...");
            stack.setConfig("aws:region", new ConfigValue("us-west-2"));
            System.out.println("Config set");

            // Refresh stack
            System.out.println("Refreshing stack...");
            stack.refresh(RefreshOptions.builder().onStandardOutput(System.out::println).build());
            System.out.println("Refresh complete");

            if (destroy) {
                System.out.println("Destroying stack...");
                stack.destroy(DestroyOptions.builder().onStandardOutput(System.out::println).build());
                System.out.println("Stack destroy complete");
            } else {
                System.out.println("Updating stack...");
                var result = stack.up(UpOptions.builder().onStandardOutput(System.out::println).build());

                if (result.getSummary().getResourceChanges() != null) {
                    System.out.println("Update summary:");
                    result.getSummary().getResourceChanges()
                            .forEach((key, value) -> System.out.println("    " + key + ": " + value));
                }

                System.out.println("Website URL: " + result.getOutputs().get("website_url").getValue());
            }
        } catch (AutomationException ex) {
            // Print the exception message
            System.err.println("An exception occured while running the inline Pulumi program: " + ex.getMessage());

            System.err.print("Stack trace: ");
            ex.printStackTrace();
        }
    }
}
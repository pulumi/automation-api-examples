package com.pulumi;

import com.pulumi.aws.s3.inputs.BucketOwnershipControlsRuleArgs;
import com.pulumi.automation.*;
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

public class App {
    public static void main(String[] args) {
        var projectName = "inline_s3_project_java";
        var stackName = "dev";

        var destroy = args.length > 0 && args[0].equals("destroy");
        try (var stack = LocalWorkspace.createOrSelectStack(projectName, stackName, App::pulumiProgram)) {
            System.out.println("Successfully initialized stack");

            // Install required Pulumi plugins
            System.out.println("Installing plugins...");
            stack.workspace().installPlugin("aws", "v6.68.0");
            System.out.println("Plugins installed");

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

                var changes = result.summary().resourceChanges();
                if (!changes.isEmpty()) {
                    System.out.println("Update summary:");
                    changes.forEach((key, value) -> System.out.printf("    %s: %d%n", key, value));
                }

                System.out.println("Website URL: " + result.outputs().get("website_url").value());
            }
        } catch (Exception ex) {
            // Print the exception message
            System.err.println("An exception occured while running the inline Pulumi program: " + ex.getMessage());

            System.err.print("Stack trace: ");
            ex.printStackTrace();
        }
    }

    private static void pulumiProgram(Context ctx) {

        // Create an AWS resource (S3 Bucket)
        var siteBucket = new BucketV2("s3-website-bucket");

        var website = new BucketWebsiteConfigurationV2("website", BucketWebsiteConfigurationV2Args.builder()
                .bucket(siteBucket.id())
                .indexDocument(BucketWebsiteConfigurationV2IndexDocumentArgs.builder()
                        .suffix("index.html")
                        .build())
                .build());

        var ownershipControls = new BucketOwnershipControls("ownershipControls", BucketOwnershipControlsArgs.builder()
                .bucket(siteBucket.id())
                .rule(BucketOwnershipControlsRuleArgs.builder()
                        .objectOwnership("ObjectWriter")
                        .build())
                .build());

        var publicAccessBlock = new BucketPublicAccessBlock("publicAccessBlock", BucketPublicAccessBlockArgs.builder()
                .bucket(siteBucket.id())
                .blockPublicAcls(false)
                .build());

        String indexContent = "<html>\n" +
                "    <head><title>Hello S3</title><meta charset=\"UTF-8\"></head>\n" +
                "    <body>\n" +
                "        <p>Hello, world!</p>\n" +
                "        <p>Made with ❤️ with <a href=\"https://pulumi.com\">Pulumi</a></p>\n" +
                "    </body>\n" +
                "</html>";

        var indexHtml = new BucketObject("index.html", BucketObjectArgs.builder()
                .bucket(siteBucket.id())
                .content(indexContent)
                .contentType("text/html")
                .acl("public-read")
                .build(),
                CustomResourceOptions.builder()
                        .dependsOn(
                                publicAccessBlock,
                                ownershipControls,
                                website)
                        .build());

        // Export the name of the bucket
        ctx.export("website_url",
                website.websiteEndpoint().applyValue(websiteEndpoint -> String.format("http://%s", websiteEndpoint)));
    }
}
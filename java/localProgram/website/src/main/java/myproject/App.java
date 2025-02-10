package myproject;

import com.pulumi.Pulumi;
import com.pulumi.aws.s3.BucketV2;
import com.pulumi.aws.s3.BucketObject;
import com.pulumi.aws.s3.BucketObjectArgs;
import com.pulumi.aws.s3.BucketWebsiteConfigurationV2;
import com.pulumi.aws.s3.BucketWebsiteConfigurationV2Args;
import com.pulumi.aws.s3.inputs.BucketOwnershipControlsRuleArgs;
import com.pulumi.aws.s3.inputs.BucketWebsiteConfigurationV2IndexDocumentArgs;
import com.pulumi.aws.s3.BucketOwnershipControls;
import com.pulumi.aws.s3.BucketOwnershipControlsArgs;
import com.pulumi.aws.s3.BucketPublicAccessBlock;
import com.pulumi.aws.s3.BucketPublicAccessBlockArgs;
import com.pulumi.resources.CustomResourceOptions;

public class App {
    public static void main(String[] args) {
        Pulumi.run(ctx -> {
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
        });
    }
}

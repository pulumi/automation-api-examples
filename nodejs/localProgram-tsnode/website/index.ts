import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { PolicyDocument } from "@pulumi/aws/iam";


// Create a bucket and expose a website index document
const siteBucket = new aws.s3.Bucket("s3-website-bucket", {
    website: {
        indexDocument: "index.html",
    },
});

// Configure ownership controls for the new S3 bucket
const ownershipControls = new aws.s3.BucketOwnershipControls("ownership-controls", {
    bucket: siteBucket.bucket,
    rule: {
        objectOwnership: "ObjectWriter",
    },
});

// Configure public ACL block on the new S3 bucket
const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
    bucket: siteBucket.bucket,
    blockPublicAcls: false,
});

const indexContent = `<html><head>
<title>Hello S3</title><meta charset="UTF-8">
</head>
<body><p>Hello, world!</p><p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
</body></html>
`

// write our index.html into the site bucket
let object = new aws.s3.BucketObject("index", {
    acl: "public-read",
    bucket: siteBucket,
    content: indexContent,
    contentType: "text/html; charset=utf-8",
    key: "index.html"
}, {
    dependsOn: [ownershipControls, publicAccessBlock]
});

export const websiteUrl = siteBucket.websiteEndpoint;

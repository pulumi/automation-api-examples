import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const bucket = new aws.s3.Bucket("automation-website-bucket", {
    website: {
      indexDocument: "index.html",
    },
  });

  // HTML content that we're serving from the bucket
  let indexContent: string = `<html><head>
<title>Hello S3</title><meta charset="UTF-8">
</head>
<body><p>Hello, world!</p><p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
</body></html>
`;

    // Upload the HTML content to the bucket
  new aws.s3.BucketObject("index-html", {
    bucket: bucket,
    content: indexContent,
    contentType: "text/html; charset=utf-8",
    key: "index.html"
  });

  // Create an S3 Bucket Policy to allow public read of all objects in bucket
  function publicReadPolicyForBucket(bucketName: string): aws.iam.PolicyDocument {
    return {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [
            `arn:aws:s3:::${bucketName}/*`, // policy refers to bucket name explicitly
          ],
        },
      ],
    };
  }

  // Set the access policy for the bucket so all objects are readable
  let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: bucket.bucket, // refer to the bucket created earlier
    policy: bucket.bucket.apply(publicReadPolicyForBucket), // use output property `siteBucket.bucket`,
  });

  export const url = pulumi.interpolate`${bucket.websiteEndpoint}/index.html`;
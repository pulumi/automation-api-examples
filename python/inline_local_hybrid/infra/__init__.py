import json

import pulumi
from pulumi_aws import s3


def website_deploy() -> None:
    """Define the static S3 website used by both the CLI and automation drivers."""
    site_bucket = s3.Bucket(
        "s3-website-bucket",
        website=s3.BucketWebsiteArgs(index_document="index.html"),
    )

    index_content = """<html><head>
    <title>Hello S3</title><meta charset="UTF-8">
</head>
<body><p>Hello, world!</p><p>Made with <a href="https://pulumi.com">Pulumi</a></p>
</body></html>
"""

    s3.BucketObject(
        "index",
        bucket=site_bucket.id,
        content=index_content,
        key="index.html",
        content_type="text/html; charset=utf-8",
    )

    public_access_block = s3.BucketPublicAccessBlock(
        "public-access-block",
        bucket=site_bucket.id,
        block_public_acls=False,
    )

    def bucket_policy(bucket_id: str) -> str:
        return json.dumps(
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{bucket_id}/*"],
                    }
                ],
            }
        )

    s3.BucketPolicy(
        "bucket-policy",
        bucket=site_bucket.id,
        policy=site_bucket.id.apply(bucket_policy),
        opts=pulumi.ResourceOptions(depends_on=[public_access_block]),
    )

    pulumi.export("websiteUrl", site_bucket.website_endpoint)

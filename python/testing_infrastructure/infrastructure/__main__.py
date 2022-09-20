"""An AWS Python Pulumi program"""

import re
import pulumi
from pulumi_aws import s3, iam

# Create an AWS resource (S3 Bucket)
bucket = s3.Bucket('auto-api-bucket',
    website=s3.BucketWebsiteArgs(
        index_document="index.html"
    )
)

content = """<html><head>
<title>Hello S3</title><meta charset="UTF-8">
</head>
<body><p>Hello, world!</p><p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
</body></html>"""

uploaded_content = s3.BucketObject('index_html', 
    bucket=bucket,
    content=content,
    content_type="text/html; charset=utf-8",
    key="index.html"
)

# policy_document = bucket.id.apply(lambda bucket_name : iam.get_policy_document_output(statements=[
#     iam.GetPolicyDocumentStatementArgs(
#         principals=["*"],
#         actions=["s3:GetObject"],
#         resources=[f"arn:aws:s3:::{bucket_name}/*"]
#     )
# ])
# )

policy_document = iam.get_policy_document_output(statements=[iam.GetPolicyDocumentStatementArgs(
    principals=[iam.GetPolicyDocumentStatementPrincipalArgs(
        type="*",
        identifiers=["*"]
    )],
    actions=["s3:GetObject"],
    resources=[bucket.arn.apply(lambda bucket_arn: f"{bucket_arn}/*")]
)])

bucket_policy = s3.BucketPolicy("bucket_policy",
    bucket=bucket.bucket,
    policy=policy_document.json
)

# # Export the name of the bucket
pulumi.export('url', pulumi.Output.concat("http://", bucket.website_endpoint, "/index.html"))

import sys
import json
import os
import pulumi
from pulumi import automation as auto
from pulumi_aws import s3


# This is the pulumi program in "inline function" form
def pulumi_program():
    # Create a bucket and expose a website index document
    site_bucket = s3.Bucket("s3-website-bucket", website=s3.BucketWebsiteArgs(index_document="index.html"))
    index_content = """
    <html>
        <head><title>Hello S3</title><meta charset="UTF-8"></head>
        <body>
            <p>Hello, world!</p>
            <p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
        </body>
    </html>
    """

    # Write our index.html into the site bucket
    s3.BucketObject("index",
                    bucket=site_bucket.id,  # reference to the s3.Bucket object
                    content=index_content,
                    key="index.html",  # set the key of the object
                    content_type="text/html; charset=utf-8")  # set the MIME type of the file

    # Set the access policy for the bucket so all objects are readable
    s3.BucketPolicy("bucket-policy", bucket=site_bucket.id, policy=site_bucket.id.apply(lambda id: json.dumps({
        "Version": "2012-10-17",
        "Statement": {
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject"],
            # Policy refers to bucket explicitly
            "Resource": [f"arn:aws:s3:::{id}/*"]
        },
    })))

    # Export a secret
    pulumi.export("secret", pulumi.Output.secret("hello world"))
    # Export the website URL
    pulumi.export("website_url", site_bucket.website_endpoint)


# To destroy our program, we can run python main.py destroy
destroy = False
args = sys.argv[1:]
if len(args) > 0:
    if args[0] == "destroy":
        destroy = True

project_name = "inline_s3_project"
# We use a simple stack name here, but recommend using auto.fully_qualified_stack_name for maximum specificity.
stack_name = "dev"
# stack_name = auto.fully_qualified_stack_name("myOrgOrUser", project_name, stack_name)

# Specify a local backend instead of using the service.
project_settings=auto.ProjectSettings(
    name=project_name,
    runtime="python",
    backend={"url": "file://~/.pulumi-local"})

secrets_provider = "awskms://aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?region=us-west-2"
kms_env = os.environ.get("KMS_KEY")
if kms_env:
    secrets_provider = f"awskms://{kms_env}?region={os.environ.get('AWS_REGION')}"
if secrets_provider == "awskms://aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee?region=us-west-2":
    raise Exception("Please provide an actual KMS key for secrets_provider")

stack_settings=auto.StackSettings(
    secrets_provider=secrets_provider)

# create or select a stack matching the specified name and project.
# this will set up a workspace with everything necessary to run our inline program (pulumi_program)
stack = auto.create_or_select_stack(stack_name=stack_name,
                                    project_name=project_name,
                                    program=pulumi_program,
                                    opts=auto.LocalWorkspaceOptions(project_settings=project_settings,
                                                                    secrets_provider=secrets_provider,
                                                                    stack_settings={"dev": stack_settings}))

print("successfully initialized stack")

# for inline programs, we must manage plugins ourselves
print("installing plugins...")
stack.workspace.install_plugin("aws", "v4.0.0")
print("plugins installed")

# set stack configuration specifying the AWS region to deploy
print("setting up config")
stack.set_config("aws:region", auto.ConfigValue(value="us-west-2"))
print("config set")

print("refreshing stack...")
stack.refresh(on_output=print)
print("refresh complete")

if destroy:
    print("destroying stack...")
    stack.destroy(on_output=print)
    print("stack destroy complete")
    sys.exit()

print("updating stack...")
up_res = stack.up(on_output=print)
print(f"update summary: \n{json.dumps(up_res.summary.resource_changes, indent=4)}")
print(f"website url: {up_res.outputs['website_url'].value}")

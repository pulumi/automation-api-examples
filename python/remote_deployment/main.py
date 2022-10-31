import sys
import os

import pulumi.automation as auto


args = sys.argv[1:]
if len(args) == 0:
    print("usage: python main.py <org> [destroy]")
    sys.exit(1)

org = args[0]
project = "aws-ts-s3-folder"
stack_name = auto.fully_qualified_stack_name(org, project, "dev")
aws_region = "us-west-2"

stack = auto.create_or_select_remote_stack_git_source(
    stack_name=stack_name,
    url="https://github.com/pulumi/examples.git",
    branch="refs/heads/master",
    project_path=project,
    opts=auto.RemoteWorkspaceOptions(
        env_vars={
            "AWS_REGION":            aws_region,
            "AWS_ACCESS_KEY_ID":     os.environ["AWS_ACCESS_KEY_ID"],
            "AWS_SECRET_ACCESS_KEY": auto.Secret(os.environ["AWS_SECRET_ACCESS_KEY"]),
            "AWS_SESSION_TOKEN":     auto.Secret(os.environ["AWS_SESSION_TOKEN"]),
        },
    ),
)

destroy = len(args) > 1 and args[1] == "destroy"
if destroy:
    stack.destroy(on_output=print)
    print("Stack successfully destroyed")
    sys.exit()

up_res = stack.up(on_output=print)
print("Update succeeded!")
print(f"url: {up_res.outputs['websiteUrl'].value}")

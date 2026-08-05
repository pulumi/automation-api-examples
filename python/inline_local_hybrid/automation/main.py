import json
import os
import sys

from pulumi import automation as auto

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from infra import website_deploy


destroy = len(sys.argv) > 1 and sys.argv[1] == "destroy"
stack_name = "dev"
work_dir = os.path.join(os.path.dirname(__file__), "..", "cli")

# Reuse the CLI project's Pulumi.yaml while supplying the shared inline program.
stack = auto.create_or_select_stack(
    stack_name=stack_name,
    work_dir=work_dir,
    program=website_deploy,
)
print(f'Created/Selected stack "{stack_name}"')

print("Installing the AWS plugin")
stack.workspace.install_plugin("aws", "v4.0.0")
print("Successfully installed AWS plugin")

stack.set_config("aws:region", auto.ConfigValue(value="us-west-2"))
print("Successfully set config")
print("Starting refresh")
stack.refresh(on_output=print)
print("Refresh succeeded!")

if destroy:
    print("Starting stack destroy")
    stack.destroy(on_output=print)
    print("Stack successfully destroyed")
    sys.exit(0)

print("Starting update")
up_result = stack.up(on_output=print)
print("Update succeeded!")
print(f"URL: {up_result.outputs['websiteUrl'].value}")
print(f"Update summary: {json.dumps(up_result.summary.resource_changes, indent=2)}")

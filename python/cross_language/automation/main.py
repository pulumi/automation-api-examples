import sys
import json
import os
from pulumi import automation as auto

# To destroy our program, we can run python main.py destroy
destroy = False
args = sys.argv[1:]
if len(args) > 0:
    if args[0] == "destroy":
        destroy = True

stack_name = "dev"

work_dir = os.path.join(os.path.dirname(__file__), "..", "fargate")

# Create our stack using a local program in the ../fargate directory
stack = auto.create_or_select_stack(stack_name="dev", work_dir=work_dir)
print("successfully initialized stack")

print("setting up config")
stack.set_config("aws:region", auto.ConfigValue(value="us-west-2"))
print("config set")

print("refreshing stack")
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
print(f"website url: {up_res.outputs['url'].value}")

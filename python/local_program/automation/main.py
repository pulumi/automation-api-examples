import sys
import json
import os
import subprocess
from pulumi import automation as auto

# To destroy our program, we can run python main.py destroy
destroy = False
args = sys.argv[1:]
if len(args) > 0:
    if args[0] == "destroy":
        destroy = True

stack_name = "dev"

work_dir = os.path.join(os.path.dirname(__file__), "..", "aws-py-voting-app")

print("preparing virtual environment...")
subprocess.run(["python3", "-m", "venv", "venv"], check=True, cwd=work_dir, capture_output=True)
subprocess.run([os.path.join("venv", "bin", "python3"), "-m", "pip", "install", "--upgrade", "pip"],
               check=True, cwd=work_dir, capture_output=True)
subprocess.run([os.path.join("venv", "bin", "pip"), "install", "-r", "requirements.txt"],
               check=True, cwd=work_dir, capture_output=True)
print("virtual environment is ready!")

# Create our stack using a local program in the ../aws-py-voting-app directory
stack = auto.create_or_select_stack(stack_name="dev", work_dir=work_dir)
print("successfully initialized stack")

print("setting up config")
stack.set_config("aws:region", auto.ConfigValue(value="us-west-2"))
stack.set_config("voting-app:redis-password", auto.ConfigValue(value="my_password", secret=True))
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
print(f"app url: {up_res.outputs['app-url'].value}")

import subprocess
from pulumi import automation as auto
import os
import requests
import unittest

stack_name = "dev"
aws_region = "eu-west-1"

work_dir = os.path.join(os.path.dirname(__file__), "infrastructure")

def deploy_infrastructure():
    print("preparing virtual environment...")
    subprocess.run(["python3", "-m", "venv", "venv"], check=True, cwd=work_dir, capture_output=True)
    subprocess.run([os.path.join("venv", "bin", "python3"), "-m", "pip", "install", "--upgrade", "pip"],
                check=True, cwd=work_dir, capture_output=True)
    subprocess.run([os.path.join("venv", "bin", "pip"), "install", "-r", "requirements.txt"],
                check=True, cwd=work_dir, capture_output=True)
    print("virtual environment is ready!")

    stack = auto.create_or_select_stack(stack_name=stack_name, work_dir=work_dir)
    print("successfully initialized stack")

    print("setting up config")
    stack.set_config("aws:region", auto.ConfigValue(value=aws_region))
    print("config set")

    print("refreshing stack")
    stack.refresh(on_output=print)
    print("refresh complete")

    print("deploying infrastructure")
    up_result = stack.up(on_output=print)
    print("infrastructure deployed")

    return up_result.outputs["url"].value

def destroy_infrastructure():
    stack = auto.create_or_select_stack(stack_name=stack_name, work_dir=work_dir)
    print("destroying infrastructure")
    stack.destroy(on_output=print)
    print("infrastructure destroyed")

    print("deleting stack")
    stack.workspace.remove_stack(stack_name=stack_name)
    print("stack deleted")

class TestInfrastructure(unittest.TestCase):
    def setUp(self):
        self.url = deploy_infrastructure()
    
    def tearDown(self):
        destroy_infrastructure()

    def test_for_200_status_code(self):
        http_request = requests.get(self.url)
        self.assertEqual(200, http_request.status_code)
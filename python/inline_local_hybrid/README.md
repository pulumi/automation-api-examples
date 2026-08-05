# Inline/Local Hybrid Program

This program demonstrates how to combine an Automation API program with a
Pulumi CLI project. The same inline program is shared by both drivers:

1. `/infra` defines the static S3 website as a reusable `website_deploy`
   function.
2. `/automation` runs refresh, update, and destroy through the Automation API.
3. `/cli` supplies a normal Pulumi CLI entry point for inspecting outputs and
   driving the stack manually.

This keeps the infrastructure code debuggable as Python while preserving the
CLI workflow for one-off previews, updates, destroys, and output inspection.

## Prerequisites

1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/get-started/install/versions/)
   or later).
2. The AWS CLI with credentials configured.

Set up a virtual environment from this directory:

```shell
python3 -m venv venv
venv/bin/python3 -m pip install --upgrade pip
venv/bin/pip install -r requirements.txt
```

Run the Automation API driver from `/automation`:

```shell
venv/bin/python main.py
```

Pass `destroy` to remove the stack after the update:

```shell
venv/bin/python main.py destroy
```

The CLI driver uses the same `/infra` function. From `/cli`, use normal
commands such as:

```shell
pulumi preview
pulumi stack output
pulumi destroy
```

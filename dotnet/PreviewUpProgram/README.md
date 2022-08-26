# Preview Up Program

This program demonstrates how to use Automation API with Pulumi's Update plan accessed on CLI via `pulumi preview --save-plan <plan path>` then `pulumi up --plan <plan path>`

To run this example you'll need a few pre-reqs:
1. A Pulumi CLI installation ([v3.31.0](https://www.pulumi.com/docs/get-started/install/versions/) or later)
2. The .NET SDK, this console application is targetting .NET Core 3.1.

Running this program is just like any other .NET console application. You can run `dotnet run` from the project directory, or you could run the resulting `.exe` from the build directory in the `bin` folder. Arguments of `preview`, `up` or `destroy` are required  e.g. `donet run preview` with optional paths for the plan as a second argument.

```shell
C:\code\automation-api-examples\dotnet\PreviewUpProgram > dotnet run preview

successfully initialized stack
installing plugins...
plugins installed
refreshing stack...
Refreshing (dev):


Resources:

Duration: 0s

refresh complete
previewing changes to stack...
Previewing update (dev):

 +  pulumi:pulumi:Stack inline_preview_up-dev create
 +  random:index:RandomPet name create
 +  pulumi:pulumi:Stack inline_preview_up-dev create

Outputs:
    name: output<string>

Resources:
    + 2 to create

Update plan written to 'C:\code\automation-api-examples\dotnet\PreviewUpProgram\bin\Debug\netcoreapp3.1\dev.inline_preview_up.json'
Run `pulumi up --plan='C:\code\automation-api-examples\dotnet\PreviewUpProgram\bin\Debug\netcoreapp3.1\dev.inline_preview_up.json'` to constrain the update to the operations planned by this preview
preview summary:
    Create: 2
stack preview saved to C:\code\automation-api-examples\dotnet\PreviewUpProgram\bin\Debug\netcoreapp3.1\dev.inline_preview_up.json
```

Once the preview has been run you can then check the output of the planned changes. 


```json
{
    "manifest": {
        "time": "2022-08-26T12:47:47.1629119+10:00",
        "magic": "0ed7606e6acb5b370078e9e1a4b22051c351075d7f4f5fa6ce66e0d04bfb5ec2",
        "version": "v3.38.0"
    },
    "resourcePlans": {
        "urn:pulumi:dev::inline_preview_up::pulumi:providers:random::default_4_8_2": {
            "goal": {
                "type": "pulumi:providers:random",
                "name": "default_4_8_2",
                "custom": true,
                "checkedInputs": {
                    "version": "4.8.2"
                },
                "inputDiff": {
                    "adds": {
                        "version": "4.8.2"
                    }
                },
                "outputDiff": {},
                "parent": "urn:pulumi:dev::inline_preview_up::pulumi:pulumi:Stack::inline_preview_up-dev",
                "protect": false,
                "customTimeouts": {}
            },
            "steps": [
                "create"
            ],
            "state": {
                "version": "4.8.2"
            },
            "seed": "9zw+7c8jAXsnAymhFtcYP5J8K45kY+zw1TnXxPzuQoY="
        },
        "urn:pulumi:dev::inline_preview_up::pulumi:pulumi:Stack::inline_preview_up-dev": {
            "goal": {
                "type": "pulumi:pulumi:Stack",
                "name": "inline_preview_up-dev",
                "custom": false,
                "inputDiff": {},
                "outputDiff": {
                    "adds": {
                        "name": "04da6b54-80e4-46f7-96ec-b56ff0331ba9"
                    }
                },
                "protect": false,
                "customTimeouts": {}
            },
            "steps": [
                "create"
            ],
            "state": {
                "name": "04da6b54-80e4-46f7-96ec-b56ff0331ba9"
            },
            "seed": "RX5t8kpVz0W8+TIv2koNV/YWZAgmg60zhYa/DNFJFG4="
        },
        "urn:pulumi:dev::inline_preview_up::random:index/randomPet:RandomPet::name": {
            "goal": {
                "type": "random:index/randomPet:RandomPet",
                "name": "name",
                "custom": true,
                "checkedInputs": {
                    "__defaults": [
                        "length",
                        "separator"
                    ],
                    "length": 2,
                    "separator": "-"
                },
                "inputDiff": {
                    "adds": {
                        "__defaults": [
                            "length",
                            "separator"
                        ],
                        "length": 2,
                        "separator": "-"
                    }
                },
                "outputDiff": {},
                "parent": "urn:pulumi:dev::inline_preview_up::pulumi:pulumi:Stack::inline_preview_up-dev",
                "protect": false,
                "provider": "urn:pulumi:dev::inline_preview_up::pulumi:providers:random::default_4_8_2::04da6b54-80e4-46f7-96ec-b56ff0331ba9",
                "customTimeouts": {}
            },
            "steps": [
                "create"
            ],
            "state": {
                "id": "",
                "length": 2,
                "separator": "-"
            },
            "seed": "32uCFFfIEZ/NIlUgPv8LbYQq0Bq7kSlzMr6UqtYF2Dk="
        }
    }
}

```
Then apply the changeset with up

```shell
C:\code\automation-api-examples\dotnet\PreviewUpProgram > dotnet run up C:\code\automation-api-examples\dotnet\PreviewUpProgram\bin\Debug\netcoreapp3.1\dev.inline_preview_up.json

successfully initialized stack
installing plugins...
plugins installed
refreshing stack...
Refreshing (dev):


Resources:

Duration: 1s

refresh complete
updating stack from preview C:\code\automation-api-examples\dotnet\PreviewUpProgram\bin\Debug\netcoreapp3.1\dev.inline_preview_up.json...
Updating (dev):

 +  pulumi:pulumi:Stack inline_preview_up-dev creating
 +  random:index:RandomPet name creating
 +  random:index:RandomPet name created
 +  pulumi:pulumi:Stack inline_preview_up-dev created

Outputs:
    name: "touched-walleye"

Resources:
    + 2 created

Duration: 2s

update summary:
    Create: 2
name: touched-walleye
```



To destroy our stack, we run our automation program with the `destroy` argument:

```shell
C:\code\automation-api-examples\dotnet\PreviewUpProgram > dotnet run destroy

successfully initialized stack
installing plugins...
plugins installed
refreshing stack...
Refreshing (dev):

 ~  pulumi:pulumi:Stack inline_preview_up-dev refreshing
 ~  random:index:RandomPet name refreshing
    pulumi:pulumi:Stack inline_preview_up-dev running
    random:index:RandomPet name
    pulumi:pulumi:Stack inline_preview_up-dev

Outputs:
    name: "touched-walleye"

Resources:
    2 unchanged

Duration: 1s

refresh complete
destroying stack...
Destroying (dev):

 -  random:index:RandomPet name deleting
 -  random:index:RandomPet name deleted
 -  pulumi:pulumi:Stack inline_preview_up-dev deleting
 -  pulumi:pulumi:Stack inline_preview_up-dev deleted

Outputs:
  - name: "touched-walleye"

Resources:
    - 2 deleted

Duration: 1s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run 'pulumi stack rm dev'.
stack destroy complete
```

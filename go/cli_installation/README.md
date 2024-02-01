# CLI Installation

This program demonstrates how to use the installation capabilities of the Automation API. By default Automation API expects the `pulumi` binary to be available on your `$PATH`. Using the installation capabilities you can customize which binary should be used and let the Automation API manage the installation.

Running this program is just like any other Go program. No invocation through the Pulumi CLI required:

```shell
$ go run main.go
Installing pulumi into /var/folders/4q/3skx3qb5191bjhkchcbbrmmm0000gn/T/cli_installation_exmple1292766419
Created/Selected stack "dev"
Starting update
Updating (dev)

View Live: https://app.pulumi.com/julienp/autoInstall/dev/updates/5


 +  pulumi:pulumi:Stack autoInstall-dev creating (0s)
@ Updating.....
 +  random:index:RandomPet Fluffy creating (0s)
 +  random:index:RandomPet Fluffy created (0.72s)
@ Updating....
 +  pulumi:pulumi:Stack autoInstall-dev created (3s)
Outputs:
    pet.id: "sweet-kangaroo"

Resources:
    + 2 created

Duration: 4s

Update succeeded!
pet: capable-swine
```

To destroy the stack when you're done, invoke the program with an additional `destroy` argument:

```shell
$ go run main.go destroy
Installing pulumi into /var/folders/4q/3skx3qb5191bjhkchcbbrmmm0000gn/T/cli_installation_exmple2829698449
Created/Selected stack "dev"
Starting stack destroy
Destroying (dev)

View Live: https://app.pulumi.com/julienp/autoInstall/dev/updates/6


 -  random:index:RandomPet Fluffy deleting (0s)
 -  random:index:RandomPet Fluffy deleted (0.63s)
@ Destroying....
 -  pulumi:pulumi:Stack autoInstall-dev deleting (0s)
@ Destroying....
 -  pulumi:pulumi:Stack autoInstall-dev deleted (0.92s)
Outputs:
  - pet.id: "sweet-kangaroo"

Resources:
    - 2 deleted

Duration: 3s

The resources in the stack have been deleted, but the history and configuration associated with the stack are still maintained.
If you want to remove the stack completely, run `pulumi stack rm dev`.
Stack successfully destroyed
```

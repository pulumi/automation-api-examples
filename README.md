# automation-api-examples

This repo provides full end to end examples and walk-throughs for the Pulumi Automation API. The Automation API is available for `Go`, `Node.js`, `Python`, `C#`, and `Java`.

Full docs for automation API can be found here:
- [Go](https://pkg.go.dev/github.com/pulumi/pulumi/sdk/v3/go/auto?tab=doc)
- [Node.js](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/pulumi/automation/)
- [Python](https://www.pulumi.com/docs/reference/pkg/python/pulumi/#module-pulumi.automation)
- [C#](https://www.pulumi.com/docs/reference/pkg/python/pulumi/#module-pulumi.automation)
- [Java](https://www.pulumi.com/docs/reference/pkg/java/com/pulumi/automation/package-summary.html)

## Content

Take a look at our examples grouped by language.

### Go Examples

Example   | Description |
--------- | --------- |
[Git Repo](go/git_repo_program) | Use Automation API with a Pulumi program from a git repo. In this case a static S3 website from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-go-s3-folder).
[Inline Program](go/inline_program) | Use Automation API with an `inline` Pulumi program. Inline programs are self contained in a single `main.go` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-go-s3-folder).
[Local Program](go/local_program) | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program. We add an Automation API deployment program to our Fargate program that deploys a web service via a Fargate task behind a load balancer.
[Inline/Local Hybrid Program](go/inline_local_hybrid) | This example shows how to refactor your infrastructure to get the best of both worlds, a debuggable `inline` program that can still be driven by the Pulumi CLI for convenience (one-off deployments, inspecting the stack, retrieving outputs, etc). In this example we deploy an S3 static website. The `automation/main.go` is fully debuggable, including the shared deployment function. The stack can also be managed via the CLI program in `cli/main.go`.
[Multi-Stack Orchestration](go/multi_stack_orchestration) | This example shows how to use Automation API to tame the complexity of multiple stacks with dependent stack outputs. We decompose our S3 static website into two stacks, one that manages the bucket, and another that manages the `index.html` file. Both of these are defined as inline programs, and are deployed and destroyed together via a single `main.go`
[Pulumi Over HTTP - Infra as RESTful resources](go/pulumi_over_http) | This application demonstrates how to run Automation API in an HTTP server to expose infrastructure as RESTful resources. In our case, we've defined and exposed a static website `site` that exposes all of the `CRUD` operations plus list. Users can hit our REST endpoint and create custom static websites by specifying the `content` field in the `POST` body. All of our infrastructure is defined in `inline` programs that are constructed and altered on the fly based on input parsed from user-specified `POST` bodies.
[Database Migration](go/database_migration) | This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.
[Cloud-backed Secret Provider](go/inline_secrets_provider) | This example demonstrates an inline program using a cloud-backed (KMS) secret provider.
[Passphrase Secret Provider](go/inline_passphrase_secrets_provider) | This example demonstrates an inline program using a passphrase secret provider.
[Remote Deployment](go/remote_deployment) | This example demonstrates how to use Automation API to run Pulumi programs remotely with Pulumi Deployments. In this case a static S3 website from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder).


### Node.js Examples

Example  | Toolchain | Description |
--------- | --------- | --------- |
[Inline Program](nodejs/inlineProgram-tsnode) | Typescript + ts-node | Use Automation API with an `inline` Pulumi program. Inline programs are self-contained in a single `index.ts` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder). This example uses `typescript` with `ts-node` as an execution environment.
[Inline Program](nodejs/inlineProgram-ts) | Typescript (tsc) + node | Use Automation API with an `inline` Pulumi program. Inline programs are self-contained in a single `index.ts` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder). This example uses `typescript` compiled into `javascript` via `tsc` and executed via `node`.
[Inline Program](nodejs/inlineProgram-js) | Javascript + node | Use Automation API with an `inline` Pulumi program. Inline programs are self-contained in a single `index.js` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-js-s3-folder). This example uses plain `javascript` executed via `node`.
[Local Program](nodejs/localProgram-tsnode) | Typescript + ts-node | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program. We add an Automation API deployment program to our existing CLI-driven S3 website program. This example uses `typescript` with `ts-node` as an execution environment.
[Cross-Language Program](nodejs/crossLanguage-tsnode) | Typescript + ts-node | This example shows how to use Automation API in `typescript` with an existing traditional CLI-driven Pulumi program written in a __different__ language, in this case `go`. We add an Automation API deployment program to our Fargate program that deploys a web service via a Fargate task behind a load balancer. This automation program uses `typescript` with `ts-node` as an execution environment.
[Pulumi Over HTTP - Infra as RESTful resources](nodejs/pulumiOverHttp-ts) | Typescript (tsc) + node | This application demonstrates how to run Automation API in an HTTP server to expose infrastructure as RESTful resources. In our case, we've defined and exposed a static website `site` that exposes all of the `CRUD` operations plus list. Users can hit our REST endpoint and create custom static websites by specifying the `content` field in the `POST` body. All of our infrastructure is defined in `inline` programs that are constructed and altered on the fly based on input parsed from user specified `POST` bodies.
[Database Migration](nodejs/databaseMigration-ts) | Typescript (tsc) + node | This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.
[Local Program with mocha tests](nodejs/localProgram-tsnode-mochatests) | Typescript + ts-node | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program alongside some mocha-based integration tests to ensure that the infrastructure was set up properly. This example uses `typescript` with `ts-node` as an execution environment, with `mocha` being used to run the tests.
[Remote Deployment](nodejs/remoteDeployment-tsnode) | Typescript + ts-node | This example demonstrates how to use Automation API to run Pulumi programs remotely with Pulumi Deployments. In this case a static S3 website from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder).

### Python Examples

Example  | Description |
--------- | --------- |
[Inline Program](python/inline_program) | Use Automation API with an `inline` Pulumi program. Inline programs are self contained in a single `main.py` and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-py-s3-folder).
[Cross-Language Program](python/cross_language) | This example shows how to use Automation API in `python` with an existing traditional CLI-driven Pulumi program written in a __different__ language, in this case `go`. We add an Automation API deployment program to our Fargate program that deploys a web service via a Fargate task behind a load balancer.
[Database Migration](python/database_migration) | This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.
[Local Program](python/local_program) | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program. We add an Automation API deployment program to our existing CLI-driven app described in the [aws-py-voting-app](https://github.com/pulumi/examples/tree/master/aws-py-voting-app) example.
[Pulumi Over HTTP - Infra as RESTful resources](python/pulumi_over_http) | This application demonstrates how to run Automation API in an HTTP server to expose infrastructure as RESTful resources. In our case, we've defined and exposed a static website `site` that exposes all of the `CRUD` operations plus list. Users can hit our REST endpoint and create custom static websites by specifying the `content` field in the `POST` body. All of our infrastructure is defined in `inline` programs that are constructed and altered on the fly based on input parsed from user specified `POST` bodies.
[Pulumi Via Jupyter](python/pulumi_via_jupyter) | This example explores running Pulumi through a Jupyter Notebook.
[Remote Deployment](python/remote_deployment) | This example demonstrates how to use Automation API to run Pulumi programs remotely with Pulumi Deployments. In this case a static S3 website from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder).

### .NET Examples

Example  | Description |
--------- | --------- |
[Inline Program](dotnet/InlineProgram) | Use Automation API with an `inline` Pulumi program. Inline programs are self contained in a .NET console application and support full debugging capabilities. In this demo we deploy the same static S3 website adapted from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-cs-s3-folder).
[Local Program](dotnet/LocalProgram) | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program. We add an Automation API deployment program to our existing CLI-driven S3 website program.
[Cross-Language Program](dotnet/CrossLanguage) | This example shows how to use Automation API in `dotnet` with an existing traditional CLI-driven Pulumi program written in a __different__ language, in this case `go`. We add an Automation API deployment program to our Fargate program that deploys a web service via a Fargate task behind a load balancer.
[Database Migration](dotnet/DatabaseMigration) | This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.
[Remote Deployment](dotnet/RemoteDeployment) | This example demonstrates how to use Automation API to run Pulumi programs remotely with Pulumi Deployments. In this case a static S3 website from the [Pulumi examples repo](https://github.com/pulumi/examples/tree/master/aws-ts-s3-folder).


### Java Examples

Example  | Description |
--------- | --------- |
[Inline Program](java/inlineProgram) | Use Automation API with an `inline` Pulumi program. Inline programs are self contained in a Java console application and support full debugging capabilities. In this demo we deploy a static S3 website.
[Local Program](java/localProgram) | This example shows how to use Automation API with an existing traditional CLI-driven Pulumi program. We add an Automation API deployment program to our existing CLI-driven S3 website program.
[Database Migration](java/databaseMigration) | This example provisions an AWS Aurora SQL database and executes a database "migration" using the resulting connection info. This migration creates a table, inserts a few rows of data, and reads the data back to verify the setup. This is all done in a single program using an `inline` Pulumi program. With Automation API you can orchestrate complex workflows that go beyond infrastructure provisioning and into application management, database setup, etc.

## Other projects using Automation API

Project | Description |
--- | ---
[Ploy](https://github.com/jaxxstorm/ploy) | Ploy is a CLI used to deploy a local Docker image to an EKS cluster.
[Halloumi](https://github.com/pulumi/halloumi) | Pulumi + Heroku = Halloumi. You write your application, we run it in the cloud.
[Self Service Platyform](https://github.com/komalali/self-service-platyform) | A webapp skeleton for building your own Infrastructure Platform using Python and Flask.

If you have a project using Automation API that you'd like to showcase here please submit a PR!

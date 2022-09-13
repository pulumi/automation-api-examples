using InlineLocalHybrid.Infra;
using Pulumi;

await Deployment.RunAsync<AwsStaticWebsiteStack>();

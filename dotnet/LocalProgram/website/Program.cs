using System.Threading.Tasks;
using Pulumi;

namespace Website
{
    class Program
    {
        static Task Main(string[] args)
            => Deployment.RunAsync<WebsiteStack>();
    }
}

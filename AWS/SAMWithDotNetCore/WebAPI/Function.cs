using System.Threading.Tasks;
using PublicSampleCode.Common;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace PublicSampleCode.Api
{
    public class Function
    {
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            var body = CommonProcesses.ReturnSomething();
            return new APIGatewayProxyResponse
            {
                Body = body,
                StatusCode = 200,
            };
        }
    }
}

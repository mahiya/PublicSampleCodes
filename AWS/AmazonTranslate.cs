// dotnet add package AWSSDK.Translate --version 3.3.101.7
using System;
using System.Threading.Tasks;
using Amazon;
using Amazon.Translate;
using Amazon.Translate.Model;

namespace TranslateSample
{
    class Program
    {
        static async Task Main()
        {
            var region = RegionEndpoint.APNortheast1;
            var client = new AmazonTranslateClient(region);
            var request = new TranslateTextRequest
            {
                SourceLanguageCode = "ja",
                TargetLanguageCode = "en",
                Text = "おはようございます"
            };
            var resp = await client.TranslateTextAsync(request);
            var result = resp.TranslatedText;
            Console.WriteLine(result);
        }
    }
}

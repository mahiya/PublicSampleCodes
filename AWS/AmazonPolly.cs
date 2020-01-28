// dotnet add package AWSSDK.Polly --version 3.3.103.39
using System.IO;
using System.Threading.Tasks;
using Amazon;
using Amazon.Polly;
using Amazon.Polly.Model;

namespace PollySample
{
    class Program
    {
        static async Task Main()
        {
            // クライアントを作成
            var region = RegionEndpoint.APNortheast1;
            var client = new AmazonPollyClient(region);

            // Amazon Polly を呼び出してテキストを音声に変換する
            var request = new SynthesizeSpeechRequest
            {
                VoiceId = VoiceId.Mizuki,
                LanguageCode = LanguageCode.JaJP,
                OutputFormat = OutputFormat.Mp3,
                Text = "こんにちは"
            };
            var resp = await client.SynthesizeSpeechAsync(request);

            // 取得した音声データをファイルに保存する
            const string fileName = "result.mp3";
            using (var stream = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.Write))
            {
                int read;
                byte[] buffer = new byte[1024];
                while ((read = await resp.AudioStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    await stream.WriteAsync(buffer, 0, read);
                }
            }
        }
    }
}
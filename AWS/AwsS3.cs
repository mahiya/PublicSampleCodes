using System.IO;
using System.Threading.Tasks;
// dotnet add package AWSSDK.S3
using Amazon.S3;
using Amazon.S3.Transfer;

namespace AwsS3Sample
{
    class Program
    {
        static async Task Main()
        {
            var region = Amazon.RegionEndpoint.APNortheast1;
            var client = new AmazonS3Client(region);
            var transfer = new TransferUtility(client);

            const string bucketName = "mahiya-sample";

            // ファイルのアップロード
            const string uploadFilePath = "s3_sample_upload.txt";
            const string key = "s3_sample.txt";
            await File.WriteAllTextAsync(uploadFilePath, "Hello S3 !!");
            await transfer.UploadAsync(uploadFilePath, bucketName, key);

            // ファイルのダウンロード
            const string downloadFilePath = "s3_sample_download.txt";
            await transfer.DownloadAsync(downloadFilePath, bucketName, key);
        }
    }
}

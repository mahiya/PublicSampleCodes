using System;
using System.Linq;
using System.Threading.Tasks;
// dotnet add package AWSSDK.SQS
using Amazon.SQS;
using Amazon.SQS.Model;

namespace AmazonSqsSample
{
    class Program
    {
        static async Task Main()
        {
            var client = new AmazonSQSClient();
            const string queueUrl = "<please input your queue's url>";

            // メッセージをエンキューする
            await client.SendMessageAsync(queueUrl, "Hello SQS !!");

            // 複数のメッセージをエンキューする
            await client.SendMessageBatchAsync(queueUrl, Enumerable.Range(0, 5).Select(i => new SendMessageBatchRequestEntry
            {
                Id = i.ToString(),
                MessageBody = "Hello SQS !! - " + i,
            }).ToList());

            // メッセージをデキューする
            var receiveMessageRequest = new ReceiveMessageRequest
            {
                QueueUrl = queueUrl,
                MaxNumberOfMessages = 10,
            };
            var messages = (await client.ReceiveMessageAsync(receiveMessageRequest)).Messages;

            foreach (var message in messages)
            {
                // メッセージの内容を表示する
                Console.WriteLine(message.Body);

                // メッセージを削除する
                await client.DeleteMessageAsync(queueUrl, message.ReceiptHandle);
            }
        }
    }
}

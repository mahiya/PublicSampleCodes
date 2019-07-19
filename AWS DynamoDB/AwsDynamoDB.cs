using System;
using System.Collections.Generic;
using System.Threading.Tasks;
// Install-Package AWSSDK.DynamoDBv2
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.DynamoDBv2.DocumentModel;

namespace DynamoDbSample
{
    class Program
    {
        static void Main()
        {
            RunAsync().Wait();
        }

        static async Task RunAsync()
        {
            var tableName = "SampleTable";
            var client = new AmazonDynamoDBClient(Amazon.RegionEndpoint.APSoutheast1);

            // テーブルを作成する
            var request = new CreateTableRequest
            {
                TableName = tableName,
                KeySchema = new List<KeySchemaElement>
                {
                    new KeySchemaElement("Partition", KeyType.HASH)
                },
                AttributeDefinitions = new List<AttributeDefinition>
                {
                    new AttributeDefinition("Partition", ScalarAttributeType.S)
                },
                BillingMode = BillingMode.PAY_PER_REQUEST,
            };
            await client.CreateTableAsync(request);

            // テーブル名一覧取得して表示する
            var tableNames = (await client.ListTablesAsync()).TableNames;
            tableNames.ForEach(Console.WriteLine);

            // テーブルの状態を確認する
            while(true)
            {
                var description = await client.DescribeTableAsync(tableName);
                Console.WriteLine("TableStatus = {0}", description.Table.TableStatus);
                if (description.Table.TableStatus == TableStatus.ACTIVE) break;
                System.Threading.Thread.Sleep(1000);
            }

            // テーブルを参照する
            var table = Table.LoadTable(client, tableName);

            // テーブルにドキュメントを追加する
            var document = new Document();
            document["Partition"] = "Egg";
            document["PropS"] = "Hiyama";
            document["PropI"] = 123;
            document["PropB"] = true;
            document["PropD"] = DateTime.Now;
            await table.PutItemAsync(document);

            // 特定のドキュメントを検索する
            var search = table.Query("Egg", new Expression());
            var docs = await search.GetNextSetAsync();
            foreach(var doc in docs)
            {
                foreach(var key in doc.Keys)
                {
                    Console.WriteLine("{0} = {1}", key, doc[key]);
                }
            }

            // テーブルを削除する
            await client.DeleteTableAsync(tableName);
        }
    }
}

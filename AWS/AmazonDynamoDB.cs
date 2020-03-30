using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

// dotnet add package AWSSDK.DynamoDBv2
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.DynamoDBv2.DataModel;

namespace AmazonDynamoDbSample
{
    class Program
    {
        const string TABLE_NAME = "SampleTable";

        static async Task Main()
        {
            var region = Amazon.RegionEndpoint.APNortheast1; // 使用するリージョン
            var client = new AmazonDynamoDBClient(region);

            // 使用するDynamoDBテーブルを作成する
            await CreateTableIfNotExistsAsync(client, TABLE_NAME);

            using (var context = new DynamoDBContext(client))
            {
                //
                // データの追加 (PutItem処理)
                //
                var item = new SampleTableData
                {
                    PartitionKey = 0,
                    SortKey = "SK0",
                    Property1 = DateTime.Now
                };
                await context.SaveAsync(item);

                //
                // 複数データの追加 (BatchWriteItem処理)
                //
                var batchWrite = context.CreateBatchWrite<SampleTableData>();
                var items = Enumerable.Range(1, 9).Select(i => new SampleTableData
                {
                    PartitionKey = 0,
                    SortKey = "SK" + i,
                    Property1 = DateTime.Now
                });
                batchWrite.AddPutItems(items);
                await batchWrite.ExecuteAsync();

                //
                // データの取得 (Query処理)
                //
                const int scanPartitionKey = 0;
                var queriedItems = await context.QueryAsync<SampleTableData>(scanPartitionKey).GetRemainingAsync();

                //
                // データの削除 (DeleteItem処理)
                //
                await context.DeleteAsync(queriedItems.First());

                //
                // 複数データの削除 (DeleteItem処理)
                //
                var batchDelete = context.CreateBatchWrite<SampleTableData>();
                batchDelete.AddDeleteItems(queriedItems.Skip(1).Take(4));
                await batchDelete.ExecuteAsync();
            }
        }

        [DynamoDBTable(TABLE_NAME)]
        class SampleTableData
        {
            [DynamoDBHashKey("PK")]
            public int PartitionKey { get; set; }

            [DynamoDBRangeKey("SK")]
            public string SortKey { get; set; }

            [DynamoDBProperty("Property1")]
            public DateTime Property1 { get; set; }
        }

        // テーブルを作成する
        static async Task CreateTableIfNotExistsAsync(AmazonDynamoDBClient client, string tableName)
        {
            // テーブル名一覧を取得して、既に存在していないかを確認する
            var tableNames = (await client.ListTablesAsync()).TableNames;
            if (tableNames.Exists(n => n == tableName)) return;

            // 作成するテーブルの定義を行う
            const string partitionKeyName = "PK";
            const string sortKeyName = "SK";
            var request = new CreateTableRequest
            {
                TableName = tableName,
                KeySchema = new List<KeySchemaElement>
                {
                    // パーティションキーとソートキーのカラム名の指定
                    new KeySchemaElement(partitionKeyName, KeyType.HASH),
                    new KeySchemaElement(sortKeyName, KeyType.RANGE)
                },
                AttributeDefinitions = new List<AttributeDefinition>
                {
                    // パーティションキーとソートキーのデータタイプの指定
                    new AttributeDefinition(partitionKeyName, ScalarAttributeType.N),
                    new AttributeDefinition(sortKeyName, ScalarAttributeType.S)
                },
                // 課金タイプの指定 (Provisioned か On-demand)
                BillingMode = BillingMode.PAY_PER_REQUEST,
            };

            // テーブルを作成する
            await client.CreateTableAsync(request);

            // テーブルの作成が完了するまで待つ
            while (true)
            {
                var description = await client.DescribeTableAsync(tableName);
                Console.WriteLine("Table Status: {0}", description.Table.TableStatus);
                if (description.Table.TableStatus == TableStatus.ACTIVE) break;
                System.Threading.Thread.Sleep(1000);
            }
        }
    }
}

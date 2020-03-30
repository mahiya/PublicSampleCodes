// npm install aws-sdk
// npm install -D typescript @types/aws-sdk
import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

main();

async function main(): Promise<any> {

    const TableName = "SampleTable";
    const Region = "ap-northeast-1";

    // 使用するDynamoDBテーブルの作成
    await CreateTableIfNotExists(TableName, Region);

    // クライアントインスタンスの作成
    const clientOptions: ServiceConfigurationOptions = {
        region: Region
    };
    const client = new DocumentClient(clientOptions);

    //
    // データの追加 (PutItem処理)
    //
    for (let pk = 0; pk < 3; pk++) {
        for (let sk = 0; sk < 3; sk++) {
            const putItemInput: DocumentClient.PutItemInput = {
                TableName: TableName,
                Item: {
                    PK: pk,
                    SK: "SK-" + sk
                }
            };
            await client.put(putItemInput).promise();
        }
    }

    //
    // 全データの取得 (Scan処理)
    //
    const scanInput: DocumentClient.ScanInput = {
        TableName: TableName
    };
    const scanOutput = await client.scan(scanInput).promise();
    const scanedItems = scanOutput.Items as DocumentClient.ItemList;
    console.log(`scanedItems = ${JSON.stringify(scanedItems)}`);

    //
    // 一部データの取得 (Query処理)
    //
    const queryInput: DocumentClient.QueryInput = {
        TableName: TableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": 1
        },
        ProjectionExpression: "PK, SK"
    };
    const queryOutput = await client.query(queryInput).promise();
    const queriedItems = queryOutput.Items;
    console.log(`queriedItems = ${JSON.stringify(queriedItems)}`);

    //
    // データの削除 (DeleteItem処理)
    //
    for (let i = 0; i < scanedItems.length; i++) {
        const item = scanedItems[i];
        const deleteItemInput: DocumentClient.DeleteItemInput = {
            TableName: TableName,
            Key: {
                PK: item.PK,
                SK: item.SK
            }
        }
        await client.delete(deleteItemInput).promise();
    }

}

// DynamoDBテーブルを作成する
async function CreateTableIfNotExists(tableName: string, region: string) {

    // クライアントインスタンスの作成
    const config: DynamoDB.ClientConfiguration = {
        region: region
    };
    const client = new DynamoDB(config);

    // テーブル名一覧を取得して、既に存在していないかを確認する
    const tableNames = (await client.listTables().promise()).TableNames;
    if (tableNames?.includes(tableName)) return;

    // 作成するテーブルの定義を行う
    const createTableInput: DynamoDB.CreateTableInput = {
        TableName: tableName,
        // パーティションキーとソートキーのカラム名の指定
        KeySchema: [
            {
                AttributeName: "PK",
                KeyType: "HASH"
            },
            {
                AttributeName: "SK",
                KeyType: "RANGE"
            }
        ],
        // パーティションキーとソートキーのデータタイプの指定
        AttributeDefinitions: [
            {
                AttributeName: "PK",
                AttributeType: "N"
            },
            {
                AttributeName: "SK",
                AttributeType: "S"
            }
        ],
        // 課金タイプの指定 (Provisioned か On-demand)
        BillingMode: "PAY_PER_REQUEST"
    };

    // テーブルを作成する
    await client.createTable(createTableInput).promise();

    // テーブルの作成が完了するまで待つ
    while (true) {
        const describeTableInput: DynamoDB.DescribeTableInput = {
            TableName: tableName
        };
        const description = await client.describeTable(describeTableInput).promise();
        if (description.Table?.TableStatus == "ACTIVE") break;
        await sleep(1000);
    }

}

// Sleep処理
function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

(async () => {

    // npm install aws-sdk
    var AWS = require("aws-sdk");

    // テーブルのクライアントを作成
    AWS.config.update({region: 'ap-northeast-1'});
    var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    var tableName = "DebugTable";

    // データを追加
    var primaryKeys = [ "p1", "p2", "p3" ];
    for (let i in primaryKeys) {
        let primaryKey = primaryKeys[i];
        let putParams = {
            TableName: tableName,
            Item: {
                primaryKey: primaryKey,
                prop1: "abc",
                prop2: 123,
                prop3: true,
            }
        };
        await client.put(putParams).promise();
    }

    // 全データを取得
    var allDataParams = {
        TableName: tableName,
    }
    var allData = await client.scan(allDataParams).promise();
    console.log(JSON.stringify(allData, null, 2));

    // 特定のキーのデータを取得
    var params = {
        TableName: tableName,
        Key:{
            primaryKey: primaryKeys[0],
        }
    };
    var result = await client.get(params).promise();
    console.log(JSON.stringify(result, null, 2));

    // データを削除    
    for (let i in primaryKeys) {
        let primaryKey = primaryKeys[i];
        let deleteParams = {
            TableName: tableName,
            Key: {
                primaryKey: primaryKey,
            }
        }
        await client.delete(deleteParams).promise();
    }

})();


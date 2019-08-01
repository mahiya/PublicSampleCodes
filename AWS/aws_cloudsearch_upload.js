(async () => {

    // npm install aws-sdk
    var AWS = require('aws-sdk');
    AWS.config.update({ region: 'ap-northeast-1' });

    // クライアントを作成する
    var client = new AWS.CloudSearchDomain({
        endpoint: '',
    });

    // アップロードするドキュメントを準備する
    var documents = 
    [
        {
            type: 'add',
            id: 'abc123',
            fields: {
                field1: "value1",
                field2: "value2",
                field3: "value3",
            }
        }
    ];

    // ドキュメントをアップロードする
    var result = await client.uploadDocuments({
        contentType: "application/json",
        documents: documents,
    }).promise();

})();


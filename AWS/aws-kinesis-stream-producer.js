(async () => {

    // AWS SDK をインポートする
    // npm install aws-sdk
    var AWS = require('aws-sdk');

    // Kinesis Data Stream のクライアントを作成
    var kinesis = new AWS.Kinesis({ region: 'ap-northeast-1' });

    // 使用するストリームの名前を指定
    var streamName = "";

    // 送信するデータを準備
    var data = JSON.stringify({
        time: new Date().getMilliseconds(),
    });

    // データをストリームへ送信する
    var partitionKey = "SamplePartitionKey";
    await kinesis.putRecord({
        StreamName: streamName,
        PartitionKey: partitionKey,
        Data: data,
    }).promise();

})();
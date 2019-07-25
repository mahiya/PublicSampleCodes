(async () => {

    // npm install aws-sdk
    var AWS = require("aws-sdk");
    AWS.config.update({region: "ap-northeast-1"});

    // AWS SQS クライアントを作成し、URLを指定する
    var sqs = new AWS.SQS();
    var queueUrl = "https://sqs.ap-northeast-1.amazonaws.com/xxxxxxx/xxxxxxxx";

    //  メッセージをキューに送信する
    var sendResult = await sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: "Hello AWS SQS !!",
    }).promise();
    console.log("Sent Result = " + JSON.stringify(sendResult, null, 2));    

    // メッセージをキューから取得する
    var received = await sqs.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
    }).promise();
    console.log("Received Data = " + JSON.stringify(received, null, 2));

    // 取得したメッセージ毎に処理をする
    for(var i in received.Messages) {
        var message = received.Messages[i];
        console.log("Message Body = " + message.Body);

        // メッセージをキューから削除する
        var deleteResult = await sqs.deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
        }).promise();
        console.log("Deleted Sesult = " + JSON.stringify(deleteResult, null, 2));
    }

})();



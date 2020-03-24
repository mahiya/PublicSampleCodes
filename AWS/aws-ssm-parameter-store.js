(async () => {

    // AWS SDK をインポートする
    var AWS = require('aws-sdk')

    // AWS System Manager クライアントを作成する
    // 参考: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
    var ssm = new AWS.SSM({ region: 'ap-northeast-1' })
    var parameterName = 'SampleParameter';

    // パラメータを設定する
    await ssm.putParameter({
        Name: parameterName,
        Type: 'String',
        Value: 'SampleValue',
        Overwrite: true
    }).promise()

    // パラメータを取得する
    var parameter = await ssm.getParameter({
        Name: parameterName,
        WithDecryption: true,
    }).promise()
    console.log(parameter);

    // パラメータを削除する
    await ssm.deleteParameter({
        Name: parameterName
    }).promise()

})();

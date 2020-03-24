(async () => {

    // 参考: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Translate.html

    // AWS SDK をインポートする
    // npm install aws-sdk
    var AWS = require('aws-sdk');
    AWS.config.update({ region: 'ap-northeast-1' });

    // テキストを翻訳して、結果を画面に表示する
    var translate = new AWS.Translate();
    var result = await translate.translateText({
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'ja',
        Text: 'This is a pen.',
    }).promise();
    console.log(result);

})();


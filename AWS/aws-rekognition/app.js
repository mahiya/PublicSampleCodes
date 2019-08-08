// AWS SDK をインポートする
// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });

// Amazon Rekognition へアップロードするパラメータを準備する
var fs = require('fs');
var image = fs.readFileSync('image.jpg');
var params = {
    Image: {
        Bytes: image,
    }
};

// Amazon Rekognition へイメージをアップロードして結果を取得する
var rekognition = new AWS.Rekognition();
rekognition.detectLabels(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
});

// 参考：
// https://docs.aws.amazon.com/ja_jp/rekognition/latest/dg/API_Operations.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html

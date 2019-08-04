// AWS SDK のインポートと設定
var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });

// S3クライアントの作成
var s3 = new AWS.S3();
var bucketName = "S3バケット名";

exports.handler = async (event, context) => {

    // S3にアップロードするファイルの名前
    var fileName = "uploadedfile";

    // PresignedURL を作成する
    return s3.createPresignedPost({
        Bucket: bucketName,
        Fields: {
            key: fileName
        },
    });

}

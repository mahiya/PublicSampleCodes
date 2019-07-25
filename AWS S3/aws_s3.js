(async () => {

    // npm install aws-sdk
    var AWS = require("aws-sdk");
    AWS.config.update({region: "ap-northeast-1"});

    // S3クライアントの作成
    var s3 = new AWS.S3();

    // S3バケットの作成
    var bucketName = "sample-bucket-" + new Date().getTime();
    var createResult = await s3.createBucket({
        Bucket: bucketName
    }).promise();
    console.log(createResult);

    // S3バケットにアップロードするファイルを作成する
    var fs = require("fs");
    var tmpFilePath = "sample.txt";
    fs.createWriteStream(tmpFilePath).write("Hello AWS S3 !!");

    // S3バケットにファイルをアップロードする
    var stream = fs.createReadStream(tmpFilePath);
    var uploadResult = await s3.upload({
        Bucket: bucketName,
        Key: tmpFilePath,
        Body: stream,
    }).promise();
    console.log(uploadResult);

    // ローカルに一時的に作成したアップロード用ファイルを削除する
    await fs.unlinkSync(tmpFilePath);

    // S3バケット内のオブジェクト一覧を取得する
    var objects = await s3.listObjects({
        Bucket: bucketName,
    }).promise();
    console.log(objects);

    // S3バケットからファイルをダウンロードする
    var object = await s3.getObject({
        Bucket: bucketName,
        Key: tmpFilePath,
    }).promise();
    console.log(object);
    console.log(object.Body.toString());
    
    // S3バケットにアップロードしたファイルを削除する
    await s3.deleteObject({
        Bucket: bucketName,
        Key: tmpFilePath,
    }).promise();

    // S3バケットの削除
    await s3.deleteBucket({
        Bucket: bucketName,
    }).promise();

})();
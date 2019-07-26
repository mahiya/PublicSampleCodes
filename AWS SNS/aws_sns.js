(async () => {

    // npm install aws-sdk
    var AWS = require("aws-sdk");
    AWS.config.update({region: "ap-northeast-1"});
    var sns = new AWS.SNS();

    var result = await sns.publish({
        Message: "Hello AWS SNS !!",
        TopicArn: ""
    }).promise();
    console.log(result);

})();



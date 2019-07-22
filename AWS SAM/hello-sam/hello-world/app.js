exports.lambdaHandler = async (event, context) => {
    try {
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world :)',
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },        
        }
    } catch (err) {
        console.error(err);
        return {
            'statusCode': 500,
            'body': JSON.stringify({
                message: err,
            }),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
        };
    }
};

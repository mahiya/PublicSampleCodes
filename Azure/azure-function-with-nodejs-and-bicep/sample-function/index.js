const variable1 = process.env['SAMPLE_ENV_VARIABLE1'];
const variable2 = process.env['SAMPLE_ENV_VARIABLE2'];

module.exports = async function (context, myTimer) {
    context.log(`This is a sample timer triggered function app.`);
};
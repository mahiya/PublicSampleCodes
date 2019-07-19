import Auth from '@aws-amplify/auth';
import awsconfig from './aws-exports';
Auth.configure(awsconfig);

const username = "";
const password = "";
Auth.signIn(username, password).then(function(data) {
    // ログイン成功
    console.log(data);
}).catch(function(err){
    // ログイン失敗
    console.error(err);
});

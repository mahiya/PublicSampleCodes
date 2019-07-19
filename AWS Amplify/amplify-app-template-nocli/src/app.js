import Amplify, { API, Auth } from 'aws-amplify';
Amplify.configure({
    Auth: {
        identityPoolId: "",
        region: "", 
        userPoolId: "", 
        userPoolWebClientId: "",
    },
    API: {
        endpoints: [
            {
                name: "MyAPIGatewayAPI",
                endpoint: ""
            }
        ]
    }
});

// ログイン処理
const username = "";
const password = "";
Auth.signIn(username, password).then(data => {
    // ログイン成功
    console.log("Login succeeded");
    console.log(data);
}).catch(err => {
    // ログイン失敗
    console.error("Login failed");
    console.error(err);
});

// API呼び出し処理
const apiName = 'MyAPIGatewayAPI';
const path = '/xxx'; 
API.get(apiName, path).then(response => {
    console.log("API call succeeded");
    console.log(response);
}).catch(error => {
    console.error("API call failed");
    console.error(error)
});
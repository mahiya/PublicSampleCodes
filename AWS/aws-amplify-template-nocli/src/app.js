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

(async function main() {

    // ログイン処理
    const username = "";
    const password = "";
    var user = await Auth.signIn(username, password);   
    
    // 一時パスワードが設定されている場合
    if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        await Auth.completeNewPassword(user, password);
    }

    // API呼び出し処理
    const apiName = 'MyAPIGatewayAPI';
    const path = '/xxx'; 
    var req = {
        headers: {
            Authorization: (await Auth.currentSession()).idToken.jwtToken
        }
    };
    var resp = await API.get(apiName, path, req);
    console.log(resp);

})();

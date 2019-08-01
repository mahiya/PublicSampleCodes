(async () => {

    // npm install request request-promise
    var request = require('request-promise');

    // AWS CloudSearch のエンドポイントと、使用するサジェスト名を指定する
    var cloudSearchEndpoint = "";
    var suggesterName = "";

    // 検索クエリを指定する
    var query = "";

    // エンドポイントを呼び出してサジェストを取得する
    var url = cloudSearchEndpoint + "/2013-01-01/suggest?suggester=" + suggesterName + "&q=" + query;
    var options = {
        url: encodeURI(url),
    };
    var resp = await request(options);

    // 取得したサジェストを画面に表示する
    var suggestions = [];
    JSON.parse(resp).suggest.suggestions.forEach((suggestion) => {
        suggestions.push(suggestion.suggestion);
    });
    console.log(suggestions);

})();

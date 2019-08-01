// npm install request request-promise
var request = require('request-promise');
var cloudSearchEndpoint = "";
var suggesterName = "";

(async () => {

    var query = "";
    var url = cloudSearchEndpoint + "/2013-01-01/suggest?suggester=" + suggesterName + "&q=" + query;
    var options = {
        url: encodeURI(url),
    };
    var resp = await request(options);

    var suggestions = [];
    JSON.parse(resp).suggest.suggestions.forEach((suggestion) => {
        suggestions.push(suggestion.suggestion);
    });
    console.log(suggestions);

})();

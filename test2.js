require('dotenv-extended').load();

// var apiai = require("../module/apiai");
var apiai = require("apiai");

var app = apiai(process.env.APIAI_TOKEN);

module.exports = {
    init: false,
    recognize: function(context, callback) {
console.log('context', context, this.init);
var sessionId = "dsfhdfg";

var user_entities = [{
    name: 'nickname',
    extend: false,
    entries: [
        {
            value: 'College',
            synonyms: ['College']
        },
        {
            value: 'Retirement',
            synonyms: ['Retirement']
        }
    ]
}];

var user_entities_body = {
    sessionId: sessionId,
    entities: user_entities
};
console.log('user_entities_body', user_entities_body);

var user_entities_request = app.userEntitiesRequest(user_entities_body);

user_entities_request.on('response', function(response) {
    console.log('User entities response: ');
    console.log(JSON.stringify(response, null, 4));

    var request = app.textRequest(context.message.text, {sessionId: sessionId});

    console.log('sessionId', sessionId);
    request.on('response', function(response) {
        console.log('Query response: ');
        console.log(JSON.stringify(response, null, 4));
        callback(null, {
            intent: response.result.metadata.intentName,
            score: response.result.score,
            parameters: response.result.parameters
        });
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
});

user_entities_request.on('error', function(error) {
    console.log(error);
});

user_entities_request.end();

}
};

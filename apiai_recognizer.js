require('dotenv-extended').load();
var apiai = require('apiai');

var app = apiai(process.env.APIAI_TOKEN);




module.exports = {
    recognize: function(context, callback) {
      var sessionId = Math.random();

      var user_entities_request = app.userEntitiesRequest({
          sessionId: sessionId,
          entities: [
              {
                  name: "nickname",
                  extend: false,
                  entries: [
                      {
                          value: "College",
                          synonyms: ["Education", "Learning"]
                      },
                      {
                          value: "Retirement",
                          synonyms: ["Roth", "Traditional"]
                      }
                  ]
              }
          ]
      });

      user_entities_request.on("response", function (response) {
        var text_request = app.textRequest(context.message.text, {
            sessionId: sessionId
        });
        console.log('Query response: ');
        console.log(JSON.stringify(response, null, 4));

        text_request.on('response', function(response) {
          console.log('Query response: ');
          console.log(JSON.stringify(response, null, 4));
            var result = response.result;

            callback(null, {
                intent: result.metadata.intentName,
                score: result.score,
                parameters: result.parameters
            });
        });

        text_request.on('error', function(error) {
          console.log(error);
            callback(error);
        });

        text_request.end();
    });

    user_entities_request.end();
  }
};

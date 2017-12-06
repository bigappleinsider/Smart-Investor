require('dotenv-extended').load();
var apiai = require('apiai');

var app = apiai(process.env.APIAI_TOKEN);




module.exports = {
    recognize: function(context, callback) {
      var sessionId = Math.random();

      let user_entities_request = app.userEntitiesRequest({
          sessionId: sessionId,
          entities: [
              {
                  name: "Application",
                  extend: false,
                  entries: [
                      {
                          value: "Firefox",
                          synonyms: ["Firefox", "fox"]
                      },
                      {
                          value: "XCode",
                          synonyms: ["XCode", "xcode"]
                      }
                  ]
              }
          ]
      });

      user_entities_request.on("response", function (response) {
        var text_request = app.textRequest(context.message.text, {
            sessionId: sessionId
        });

        text_request.on('response', function(response) {
          console.log(response, context.message.text);
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

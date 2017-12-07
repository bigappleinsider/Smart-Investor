require('dotenv-extended').load();

// var apiai = require("../module/apiai");
var apiai = require("apiai");

var app = apiai(process.env.APIAI_TOKEN);

module.exports = {
    recognizeTextRequest: function(context, callback) {
        var sessionId = "dsfhdfg";
        console.log('recognizeTextRequest',
        'context.privateConversationData', context.privateConversationData,
        'context.conversationId', context.message.address.conversation.id
      );


        var request = app.textRequest(context.message.text, {sessionId: sessionId});

        request.on('response', function(response) {
            //console.log('Query response: ');
            //console.log(JSON.stringify(response, null, 4));
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
    },
    getEntities: function(sessionId) {
      return new Promise(function (resolve) {
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
        setTimeout(function(){
          resolve(user_entities);
        }, 3000);
      });
    },
    recognizeWithEntities: function(context, callback) {

      context.privateConversationData['init'] = true;
      var sessionId = "dsfhdfg";

      this.getEntities(sessionId)
        .then(function(user_entities) {
            var user_entities_body = {
                sessionId: sessionId,
                entities: user_entities
            };
            //console.log('user_entities_body', user_entities_body);

            var user_entities_request = app.userEntitiesRequest(user_entities_body);
            var that = this;
            user_entities_request.on('response', function(response) {
                //console.log('User entities response: ');
                //console.log(JSON.stringify(response, null, 4));

                that.recognizeTextRequest(context, callback);

            });

            user_entities_request.on('error', function(error) {
                console.log(error);
            });

            user_entities_request.end();
          });
    },
    recognize: function(context, callback) {
      if(!context.privateConversationData['init']) {
        this.recognizeWithEntities(context, callback);
      }
      else {
        this.recognizeTextRequest(context, callback);
      }
    }
};

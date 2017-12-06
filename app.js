require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');
var apiaiRecognizer = require('./apiai_recognizer');


var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Receive messages from the user and respond
var bot = new builder.UniversalBot(connector, {
    persistConversationData: true
});

var intents = new builder.IntentDialog({
    recognizers: [
        apiaiRecognizer
    ],
    intentThreshold: 0.2,
    recognizeOrder: builder.RecognizeOrder.series
});



intents.matches('check.balance', '/check.balance');

bot.dialog('/', intents);


bot.dialog('/check.balance', [
    function(session, args, next) {
        console.log(args);
        session.endDialog(`We are checking balance for your ${args.parameters.account_type} account`);
    }
]);


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'ID';

const SKILL_NAME = 'Test Skill';
const GET_FACT_MESSAGE = "Josue ";
const HELP_MESSAGE = 'You can say give me a fact, or tell me about github, or you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
    'is very intelligent and handsome.',
    'has amazing curly hair',
    'must not know where you hide the nutella jar',
    'is a master educated engineer.',
    'has a passion for meat. A deep passion for meat.',
    'has been a vegetarian for 10 years.',
    'doesn\'t really know the difference between B and V',
    'will be a robot engineer.',
    'loves dried, cracking leaves.',
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Hello! Would you like to ask me a fact?');
        // this.emit('GetNewFactIntent');
    },
    'TellMeAboutGithub': function () {
        const baseUrl = "https://api.github.com/users/josuevivash";
        const headers = {
            'User-Agent': 'anything apparently...'
        };
        const options = {
            headers: headers
        };
        
        request.get(baseUrl, options, (err, res, body) => {
            let result = JSON.parse(body);
            const speechOutput = `He is ${result.login}, ${result.bio}`;
            this.response.speak(speechOutput);            
            this.emit(':responseReady');            
        });
    },
    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

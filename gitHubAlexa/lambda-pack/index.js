'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.908904e4-eb7e-4bf6-96ef-291781224589';

const SKILL_NAME = 'GitHub Search';
const startOutput = "Welcome to GitHub Search. Who would you like to look for?";
const startReprompt = "Let me know the name of the user you'd like to search for on GitHub.";
const helpOutput = 'You can say get me a user, or you can say exit... What can I help you with?';
const helpReprompt = 'What can I help you with?';
const stopOutput = 'Goodbye!';

const githubUrl = "https://api.github.com/users/";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.response.speak(startOutput).listen(startReprompt);
        this.emit(":responseReady");
    },
    'SearchGitHub': function () {
        slotCollection.call(this);
        let user = this.event.request.intent.slots.User.value;
        let baseUrl = githubUrl + user;
        const headers = {
            'User-Agent': 'something'
        };
        const options = {
            headers: headers
        };
        
        request.get(baseUrl, options, (err, res, body) => {
            let result = JSON.parse(body);
            let bio = result.bio === null ? "absent" : result.bio;
            const speechOutput = `${result.login}'s description is ${bio}`;
            let cardTitle = `GitHub User ${result.login}`;
            let cardContent = `Bio: ${bio}.
            Github profile url: ${result.html_url}`;
            const imageObj = {
                smallImageUrl: result.avatar_url,
                largeImageUrl: result.avatar_url
            }; 
            this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);            
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = helpOutput;
        const reprompt = helpReprompt;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(stopOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(stopOutput);
        this.emit(':responseReady');
    },
};

function slotCollection(){
      if (this.event.request.dialogState === "STARTED") {
        var updatedIntent = this.event.request.intent;
        this.emit(":delegate", updatedIntent);
      } else if (this.event.request.dialogState !== "COMPLETED") {
        this.emit(":delegate");
      } else {
        console.log(`returning: ${JSON.stringify(this.event.request.intent)}`);
        return this.event.request.intent;
      }
  }

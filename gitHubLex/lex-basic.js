'use strict';
const request = require('request');

exports.handler = (event, context, callback) => {
    var user = event.currentIntent.slots.user;
    callback(null, getUser(User));
};

function getUser(user) {
    const baseUrl = `https://api.github.com/users/${user}`;
    const headers = {
        'User-Agent': 'something'
    };
    const options = {
        headers: headers
    };
    
    request.get(baseUrl, options, (err, res, body) => {
        let result = JSON.parse(body);
        return {
            dialogAction: {
                type: 'Close',
                fulfillmentState: "Fulfilled",
                message: {
                    contentType: "PlainText",
                    content: `I found ${result.login}, ${result.bio}`
                }
            }
        }           
    });
}

'use strict';
const request = require('request-promise');

exports.handler = (event, context, callback) => {
    let user = event.currentIntent.slots.user;
    const baseUrl = `https://api.github.com/users/${user}`;
    const headers = {
        'User-Agent': 'something'
    };
    const options = {
        headers: headers
    };

    request(baseUrl, options)
        .then(res => {
            const resParsed = JSON.parse(res);
            const response = {
                sessionAttributes: event.sessionAttributes,
                dialogAction: {
                    type: "Close",
                    fulfillmentState: "Fulfilled",
                    message: {
                        contentType: "PlainText",
                        content: `This is ${resParsed.login}'s description on github: ${resParsed.bio}`
                    }
                }
            }
            callback(null, response);
        }).catch(err => {
            console.log(err);
            const response = {
                sessionAttributes: event.sessionAttributes,
                dialogAction: {
                    type: "Close",
                    fulfillmentState: "Fulfilled",
                    message: {
                        contentType: "PlainText",
                        content: `An error occurred.`
                    }
                }
            }
            callback(null, response);
        });

};

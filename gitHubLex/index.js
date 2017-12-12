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
            // let result = JSON.parse(res);
            // let name = result.login;
            // let bio = result.bio;
            const response = {
                sessionAttributes: event.sessionAttributes,
                dialogAction: {
                    type: "Close",
                    fulfillmentState: "Fulfilled",
                    message: {
                        contentType: "PlainText",
                        content: `Thanks ${res}`
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
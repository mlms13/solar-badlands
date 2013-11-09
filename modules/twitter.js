var Twit = require('twit');
var config = require('../config.js');

var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
});

module.exports.stream = T.stream('user', {'with': 'user'});


module.exports.post = function (replyMessage) {
    T.post('statuses/update', replyMessage, function (err, reply) {
        if (err) {
            console.log('Error in Twitter.js attempting to post message');
            console.log(err);
            return;
        }

        console.log('Message posted. Check Twitter for proof.');
    });
}
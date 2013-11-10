var Twit = require('twit');
var config = require('../config.js');
var db = require('../modules/db.js');
var game = require('../modules/game.js');

var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
});

var stream = T.stream('user', {'with': 'user'});

var postMessage = function (replyMessage, callback) {
    T.post('statuses/update', replyMessage, function (err, reply) {
        if (err) {
            console.log('Error in Twitter.js attempting to post message');
            console.log(err);
        }

        callback(err, reply);
    });
};

module.exports.startClient = function () {
    // Handle incoming tweets
    stream.on('tweet', function (tweet) {
        if (tweet.text.indexOf(config.ourHandle) === 0) {
            console.log(tweet.user.screen_name + " said: " + tweet.text.replace(config.ourHandle, ''));
            game.sendInput(tweet.user.screen_name, tweet.text, function (err, response) {
                if (err) {
                    response = {name: "Looks like we're having some problems. Try again in a bit, or tweet at @mlms13 for support."};
                }

                // send `response` to user
                postMessage({ in_reply_to_status_id: tweet.id_str, status: '@' + tweet.user.screen_name + ' ' + response.text }, function (err, reply) {
                    if (err) { return; }

                    // on success, save their message and our response in the db
                    db.updateLog(tweet, reply);
                    console.log('A message was posted, check Twitter for proof.');
                });
            });
        }
    });
};

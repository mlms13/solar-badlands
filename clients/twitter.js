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

var duplicateCount = 0;

var getDupeMessageString = function () {
    // Twitter doesn't like sending the same message over and over again
    // so the user tweeting "LOOK AROUND" can be problematic if we recently posted the same thing to them.
    // This will lay out several possible messages that we can tweet back instead.
    var messages = [
        "I'm pretty sure I just told you that. Maybe try scrolling.",
        "The knowledge you seek is already available to you. In your Twitter feed.",
        "Think hard, or maybe just look a little harder. The information has already been given to you.",
        "I'm not in the mood to repeat myself. Are you in the mood to use your scroll wheel?",
        "If you make me repeat myself too much, Twitter may think I'm just a bot.",
        "I remember saying that recently. I'm sure you'll find it if you look through your feed.",
        "I just said that pretty recently. It has to be there in your feed somewhere...",
        "Check out your feed. The information you seek has already be given to you.",
        "If you're not careful, I'm going to start repeating myself.",
        "I already told you this once, it's in your Twitter feed.",
        "Scroll through your Twitter feed, the information you seek has been given already.",
        "Look through your feed. You'll find my response somewhere without me needing to repeat myself."
    ];

    // return a random message
    return messages[Math.floor(Math.random() * messages.length)];
};

var postMessage = function (replyMessage, callback) {
    T.post('statuses/update', replyMessage, function (err, reply) {
        // if twitter is complaining about a duplicate message
        if (err && err.code === 187) {
            // increase the duplicate count
            duplicateCount += 1;
            console.warn("Our message was a duplicate, so we're saying something else instead.");

            // only try posting if the duplicate count is less than 5
            // so we don't keep spamming the server with nothing but duplicate messages
            if (duplicateCount < 5) {
                // remove everything after the first space and replace it with our new message
                replyMessage.status = replyMessage.status.substring(0, replyMessage.status.indexOf(' ') + 1) + getDupeMessageString();
                // then try to re-post
                postMessage(replyMessage);
            }
            return;
        } else if (err) {
            // if the error isn't related to duplicate messages, log it
            console.error('An error happened while tring to post to Twitter.');
            console.error(err);
            return;
        }

        if (!callback) {
            console.log("There is no callback. Is that a problem?");
        }
        // call the callback and pass along the error
        callback && callback(null, reply);
    });
};

module.exports.startClient = function () {
    // Handle incoming tweets
    stream.on('tweet', function (tweet) {
        console.log('Something happened that involves us.');

        if (tweet.text.indexOf(config.ourHandle) === 0) {
            console.log(tweet.user.screen_name + " said: " + tweet.text.replace(config.ourHandle, ''));
            game.sendInput(tweet.user.screen_name, tweet.text, function (err, response) {
                if (err) {
                    response = {name: "Looks like we're having some problems. Try again in a bit, or tweet at @mlms13 for support."};
                }

                // reset the duplicate counter
                duplicateCount = 0;

                // send `response` to user
                postMessage({ in_reply_to_status_id: tweet.id_str, status: '@' + tweet.user.screen_name + ' ' + response.text }, function (err, reply) {
                    // errors are handled by the postMessage function.
                    // We'll assume there are none if this callback is called.
                    db.updateLog(tweet, reply);
                    console.log('A message was posted, check Twitter for proof.');
                });
            });
        }
    });
};

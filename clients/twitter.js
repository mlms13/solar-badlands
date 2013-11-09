var Twit = require('twit');
var config = require('../config.js');
var db = require('../modules/db.js');
var locations = require('../modules/locations.js');

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
            return;
        }

        callback(err, reply);

        console.log('Message posted. Check Twitter for proof.');
    });
};

module.exports.startClient = function () {
    // Handle incoming tweets
    stream.on('tweet', function (tweet) {
        if (tweet.text.indexOf(config.ourHandle) === 0) {

            console.log(tweet.user.screen_name + " said: " + tweet.text.replace(config.ourHandle, ''));

            db.getUser(tweet.user.screen_name, function (err, user) {
                if (err) {
                    console.log("There was an error in the db.getUser call in serverjs line 53: " + err);
                    return;
                } 
                if (user) {
                    // TODO: game parse tweet
                    console.log("this user exists");
                } else if (tweet.text.toLowerCase().indexOf("start") > -1 && tweet.text.toLowerCase().indexOf("game") > -1) {
                    db.createUser(tweet.user.screen_name, function (err, user) {
                        if (err) {
                            console.log("There was an error in the db.createUser call in serverjs line 62: " + err);
                            // TODO: tweet them that there was an error and if they're really upset to bother michael
                            return;
                        }
                        console.log(user);
                        // update user's location
                            // if no error, callback will include tweeting location.look to user
                        db.updateLocation(tweet.user.screen_name, { area: "earth", level: "room" }, function (err, saved) {
                            if (err) {
                                console.log("There was an error in the db.updateLocatioin call in serverjs line 71: " + err);
                                return;
                            }

                            db.getUser(tweet.user.screen_name, function (err, user) {
                                if (err) {
                                    console.log("There was an error in the db.getUser call in serverjs line 78: " + err);
                                    return;
                                }
                                postMessage({ in_reply_to_status_id: tweet.id_str, status: '@' + tweet.user.screen_name + ' ' + locations[user.location.area][user.location.level].message }, function (err, reply) {
                                    if (err) { console.log("There was an error in posting."); return; }
                                    db.updateLog(tweet, reply);
                                });
                            });                        
                        });
                    }); 
                } else {
                    //respond to user with instructions on starting a game
                    postMessage({ in_reply_to_status_id: tweet.id_str, status: '@' + tweet.user.screen_name + ' It doesn\'t appear you have a game yet. Reply with START GAME to begin!' }, function (err, reply) {
                        if (err) { console.log("There was an error in posting."); return; }
                        db.updateLog(tweet, reply);
                    });
                }
            });
        } else {
            console.log('Something happened, but we don\'t care about it.');
        }
    });
}
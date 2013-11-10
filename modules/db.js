var config = require('../config.js');

var collections = ["users", "log"];
var db = require("mongojs").connect(config.mongohq_uri, collections);

module.exports.getUser = function (userStr, callback) {
    db.users.findOne({handle: userStr}, function (err, user) {
        if (err) {
            console.log("There was an error in the db.getUser call: " + err);
        }
        callback(err, user);
    });
};

module.exports.createUser = function (userStr, callback) {
    db.users.save({
        handle: userStr,
        createdOn: new Date(),
        stats: {
            exp: 0,
            hp: 20,
            off: 10,
            def: 10
        }
    }, function (err, saved) {
        if (err) {
            console.log("There was an error in the db.createUser call: " + err);
        }
        callback(err, saved);
    });
};

module.exports.updateUserStats = function (userStr, stats, callback) {
    db.users.update(
        { handle: userStr },
        { $set: { stats: stats } },
        { upsert: true },
        function (err, saved) {
            if (err) {
                console.log("There was an error in the db.updateUserStats call: " + err);
            }
            callback(err, saved);
        }
    );
};

module.exports.updateLocation = function (userStr, location, callback) {
    db.users.update(
        { handle: userStr },
        { $set: { location: location } },
        { upsert: true },
        function (err, saved) {
            if (err) {
                console.log("There was an error in the db.updateLocatioin call: " + err);
            }
            callback(err, saved);
        }
    );
};

module.exports.updateLog = function (input, response) {
    db.log.update(
        { handle: input.user.screen_name },
        { $push: { history: { time: new Date(), tweet: input.text, response: response.text } } },
        { upsert: true }
    );
};

module.exports.getUserLog = function (userStr, callback) {
    db.log.findOne({handle: userStr}, function (err, log) {
        if (err) {
            console.log("There was an error in the db.getUserLog call: " + err);
        }
        callback(err, log);
    });
};

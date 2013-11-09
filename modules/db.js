var config = require('../config.js');

var collections = ["users", "log"];
var db = require("mongojs").connect(config.mongohq_uri, collections);

module.exports.getUser = function (userStr, callback) {
    db.users.findOne({handle: userStr}, function (err, user) {
        callback(err, user);
    });
};

module.exports.createUser = function (userStr, callback) {
    db.users.save({
        handle: userStr,
        createdOn: new Date()
    }, function (err, saved) {
        callback(err, saved);
    });
};

module.exports.updateLog = function (input) {
    db.log.update(
        { handle: input.user.screen_name },
        { $push: { history: input.text } },
        { upsert: true }
    );
};
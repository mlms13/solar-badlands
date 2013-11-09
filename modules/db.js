var config = require('../config.js');

var collections = ["users", "log"];
var db = require("mongojs").connect(config.mongohq_uri, collections);

module.exports.createUser = function (userStr, callback) {
    db.users.save({
        handle: userStr
    }, function (err, saved) {
        callback(err, saved);
    });
};
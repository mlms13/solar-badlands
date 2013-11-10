var Twit = require('twit');
var config = require('../config.js');

var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
});

var collections = ["users", "log"];
var db = require("mongojs").connect(config.mongohq_uri, collections);

var getUser = module.exports.getUser = function (userStr, callback) {
    db.users.findOne({handle: userStr}, function (err, user) {
        if (err) {
            console.log("There was an error in the db.getUser call: " + err);
        }
        callback(err, user);
    });
};

module.exports.createUser = function (userStr, callback) {
    // Use Twitter API to find the user's profile image.
    T.get('users/show', {screen_name: userStr}, function (err, user) {
        var imageUrl = '';
        // if we manage to get the image, cool
        if (!err) { imageUrl = user.profile_image_url; }

        // either way, we'll still create the user in the db
        db.users.save({
            handle: userStr,
            twImage: imageUrl,
            createdOn: new Date(),
            stats: {
                exp: 0,
                hp: 20,
                off: 10,
                def: 10
            },
            inventory: []
        }, function (err, saved) {
            if (err) {
                console.log("There was an error in the db.createUser call: " + err);
            }
            callback(err, saved);
        });
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

module.exports.userHasItem = function (userStr, itemName, callback) {
    getUser(userStr, function (err, user) {
        var i = 0, itemExists = false;

        if (err) {
            console.error("There was an error in userHasItem: " + err);
        }

        for (i = 0; i < user.inventory.length; i += 1) {
            if (user.inventory[i].name === itemName && user.inventory[i].qty > 0) {
                itemExists = true;
                break;
            }
        }

        callback(null, itemExists);
    });
};

var updateInventory = module.exports.updateInventory = function (userStr, inventory, callback) {
    db.users.update(
        { handle: userStr },
        { $set: { inventory: inventory } },
        { upsert: true },
        function (err, saved) {
            if (err) {
                console.log("There was an error in the db.updateInventory call: " + err);
            }
            callback(err, saved);
        }
    );
};

module.exports.addInventoryItem = function (userStr, item, callback) {
    db.users.update(
        { handle: userStr },
        { $push: { inventory: { $each: item } } },
        { upsert: true },
        function (err, saved) {
            if (err) {
                console.log("There was an error in the db.addInventoryItem call: " + err);
            }
            callback(err, saved);
        }
    );
};

module.exports.removeInventoryItem = function (userStr, item, callback) {
    getUser(userStr, function (err, user) {
        var i = 0, newInventory = user.inventory;

        if (err) {
            console.error("There was an error in removeInventoryItem: " + err);
        }

        for (i = 0; i < user.inventory.length; i += 1) {
            if (newInventory[i].name === item.name) {
                newInventory[i].qty =- 1;
                updateInventory(userStr, newInventory, function (err, saved) {
                    callback(err, saved);
                });
                break;
            }
        }

        // nothing was updated
        callback(null, 0);
    });
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

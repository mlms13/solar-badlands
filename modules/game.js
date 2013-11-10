var db = require('./db.js');
var config = require('../config.js');
var locations = require('./locations.js');

// synonyms for global actions
var globalActions = {
    'help' : {
        synonyms: ['help', "i'm stuck", 'im stuck', 'confused'],
        fn: function (user, callback) {
            console.log('The help function was called. Calling the callback.');
            callback(null, {text: "Try to GO somewhere, GET something, or LOOK AROUND. Check out http://polar-badlands.2013.nodeknockout.com/help for more."});
        }
    },
    'inventory': {
        synonyms: ['inventory', 'show inventory', 'show items', 'items'],
        fn: function (user, callback) {
            var itemStr;

            user.inventory.forEach(function (item) {
                if (item.qty > 0) {
                    itemStr += " " + item.name.toUpperCase() + ",";
                }
            });

            // remove the trailing comma, if it exists
            if (itemStr) {
                itemStr = itemStr.substring(0, itemStr.length - 1);
                itemStr = "You have the following:" + itemStr;
                callback(null, {text: itemStr});
            } else {
                callback(null, {text: "You currently have no items."});
            }
        }
    },
    'look around': {
        synonyms: ['look around', 'survey', 'surroundings'],
        fn: function (user, callback) {
            // tweet the default message for the current user.location
            callback(null, locations[user.location.area][user.location.level].actions["look around"]);
        }
    },
    'return': {
        synonyms: ['return', 'go back', 'leave'],
        fn: function (user) {
            // return to user.previousLocation
        }
    },
    'status': {
        synonyms: ['status', 'character', 'me'],
        fn: function (user) {
            // tweet stats about the user
        }
    }
};

// synonyms for common location-specific actions
var commonLocationActions = {
    'get'       : ['get', 'take', 'pick up'],
    'go'        : ['go', 'enter', 'goto'],
    'look at'   : ['look at', 'inspect', 'check out'],
    'talk'      : ['talk', 'speak', 'say', 'chat', 'ask']
};

var getInvalidOperationMessage = function () {
    // add a bunch of these to make Twitter less likely to complain about duplicate messages
    var messages = [
        "Either that is not a recognized action, or there is no use for that here. Reply with HELP if you need HELP.",
        "I'm not quite sure what you're trying to do. Try something else, or reply with HELP if you're stuck.",
        "I didn't understand that, but I think this one is on you for not making sense. Reply with HELP if you need it.",
        "Whatever you are trying to do doesn't need to be done here. Reply with HELP if you're confused.",
        "That doesn't make sense to me. If you need HELP, I'd be more than happy to give you some pointers.",
        "Thinking outside the box? You want get far if I can't understand you. Reply with HELP if you're confused.",
        "You seem to be confused, because that didn't make sense.  Reply with HELP if you need it.",
        "Do you know what you're trying to do? Because I don't. Let me know if you need HELP.",
        "I don't know what you're trying to do. If you need HELP, just say so.",
        "Maybe try something else, because that didn't make sense.  If you need some HELP, just ask."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

var getUsefulActions = function (loc) {
    var action, useful = {};

    // for each location action
    for (action in loc.actions) {
        if (loc.actions.hasOwnProperty(action)) {
            // if the action has synonyms already
            if (loc.actions[action].synonyms) {
                // add those to the "useful" object
                useful[action] = loc.actions[action].synonyms;
            } else if (commonLocationActions[action]) {
                // otherwise, find the appropriate synonyms in commonLocationActions
                useful[action] = commonLocationActions[action];
            }  
        }
    }

    for (action in globalActions) {
        if (globalActions.hasOwnProperty(action) && globalActions[action].synonyms) {
            useful[action] = globalActions[action].synonyms;
        }
    }

    return useful;
};

var parseForActions = function (loc, input, callback) {
    var i, action, useful, firstAction = {};

    // normalize the input
    input = input.replace(config.ourHandle, '').toLowerCase();

    // set up firstAction object
    firstAction.position = 141; // bigger than the length of a input

    // get a an object with all of the actions that we care about
    useful = getUsefulActions(loc);

    for (action in useful) {
        if (useful.hasOwnProperty(action)) {
            // for each synonym in the corresponding array
            for (i = 0; i < useful[action].length; i += 1) {
                // keep track of the first index of one of the words/phrases
                if (input.indexOf(useful[action][i]) > -1  &&
                    input.indexOf(useful[action][i]) < firstAction.position) {
                    firstAction.position = input.indexOf(useful[action][i]);
                    firstAction.action = action;
                }
            }
        }
    }

    // if first action is a global action, keep track of that
    firstAction.isGlobal = firstAction.action && !loc.actions[firstAction.action] && !!globalActions[firstAction.action];

    // wipe out firstAction if it didn't get set
    firstAction = firstAction.action ? firstAction : null;

    // pass an error (currently undefined), 
    callback(undefined, firstAction, input);
};

// public function to receive message (and respond appropriately)
module.exports.sendInput = function (username, input, cb) {
    var userLocation; // this will be set to the actual location level object if a user is found

    db.getUser(username, function (err, user) {
        if (err) { cb(err); return; }
        if (user) {
            // figure out the user's location (as an actual location object)
            userLocation = locations[user.location.area][user.location.level];

            // parse input for actions that make sense in this context
            parseForActions(userLocation, input, function (err, action, cleanInput) {
                if (err) { cb(err); return; }
                if (!action) {
                    cb(null, {text: getInvalidOperationMessage()});
                } else if (action.isGlobal) {
                    // Respond here
                    globalActions[action.action].fn(user, function (err, response) {
                        cb(err, response);
                    });
                } else {
                    userLocation.actions[action.action].fn(user, cleanInput, function (location, response) {
                        if (location) {
                            db.updateLocation(username, location, function (err, saved) {
                                if (err) { cb(err); return; }

                                db.getUser(username, function (err, user) {
                                    if (err) { cb(err); return; }
                                    // if no error, respond with the message object from the new location
                                    cb(null, locations[user.location.area][user.location.level].message);
                                });
                            });
                        } else {
                            cb(null, response);
                        }
                    });
                }
            });
        } else if (input.toLowerCase().indexOf("start") > -1 && input.toLowerCase().indexOf("game") > -1) {
            db.createUser(username, function (err, user) {
                if (err) { cb(err); return; }
                // update user's location
                db.updateLocation(username, { area: "earth", level: "room" }, function (err, saved) {
                    if (err) { cb(err); return; }

                    db.getUser(username, function (err, user) {
                        if (err) { cb(err); return; }
                        // if no error, callback will include tweeting location.look to user
                        cb(null, locations[user.location.area][user.location.level].message);
                    });                        
                });
            }); 
        } else {
            console.log("The user isn't in the db, and didn't say something useful.");
            //respond to user with instructions on starting a game
            cb(null, {text: "It doesn't appear you have a game yet. Reply with START GAME to begin!"});
        }
    });
};
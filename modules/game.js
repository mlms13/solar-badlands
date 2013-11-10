var db = require('./db.js');
var config = require('../config.js');
var locations = require('./locations.js');

// synonyms for global actions
var globalActions = {
    'inventory': {
        synonyms: ['inventory', 'show inventory', 'show items', 'items'],
        fn: function (user) {
            // tweet a list of the user's items
        }
    },
    'look around': {
        synonyms: ['look around', 'survey', 'surroundings'],
        fn: function (user) {
            // tweet the default message for the current user.location
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
    'go'        : ['go', 'enter'],
    'look at'   : ['look at', 'inspect']
};


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
    db.getUser(username, function (err, user) {
        if (err) { cb(err); return; }
        if (user) {
            // TODO: game parse input
            parseForActions(locations[user.location.area][user.location.level], input, function (err, action, input) {
                if (err) { cb(err); return; }
                if (!action) {
                    cb(null, "Sorry, we didn't understand what you were trying to say.  Reply with HELP if you need HELP.");
                } else if (action.isGlobal) {
                    // TODO, need to respond here after global is set up
                    globalActions[action.action].fn(user);
                } else {
                    locations[user.location.area][user.location.level].actions[action.action].fn(user, input, function (location,  response) {
                        if (location) {
                            db.updateLocation(username, location, function (err, saved) {
                                if (err) { cb(err); return; }

                                db.getUser(username, function (err, user) {
                                    if (err) { cb(err); return; }
                                    // if no error, callback will include tweeting location.look to user
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
            cb(null, "It doesn't appear you have a game yet. Reply with START GAME to begin!");
        }
    });
};
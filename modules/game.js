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

var parseForActions = function (loc, tweet, callback) {
    var i, action, useful, firstAction = {};

    // normalize the tweet
    tweet = tweet.replace('@solarbadlands', '').toLowerCase();

    // set up firstAction object
    firstAction.position = 141; // bigger than the length of a tweet

    // get a an object with all of the actions that we care about
    useful = getUsefulActions(loc);

    for (action in useful) {
        if (useful.hasOwnProperty(action)) {
            // for each synonym in the corresponding array
            for (i = 0; i < useful[action].length; i += 1) {
                // keep track of the first index of one of the words/phrases
                if (tweet.indexOf(useful[action][i]) > -1  &&
                    tweet.indexOf(useful[action][i]) < firstAction.position) {
                    firstAction.position = tweet.indexOf(useful[action][i]);
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
    callback && callback(undefined, firstAction);
};



// a simple test location

// var loc = {
//     actions: {
//         'eat alien eggs': {
//             synonyms: ['consume', 'eat eggs'],
//             fn: function () {

//             }
//         },
//         'go': {
//             fn: function () {

//             }
//         }
//     }
// }
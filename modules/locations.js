var locations = {};

locations.earth = {
    room : {
        message: {text: "You wake up in YOUR ROOM to a loud crash. It is a nice day out. There are some books to the WEST, and STAIRS to the SOUTH."},
        actions: {
            'get': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('books') > -1) {
                        callback(null, {text: 'These sure do look interesting, but you don\'t have any use for them now.'});
                    } else {
                        callback(null, {text: 'You can\'t GET that. Try doing something else, or asking for HELP.'});
                    }
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'What\'s there to LOOK AT? Nothing here is really that cool. Go outside or something.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('stairs') > -1 || text.toLowerCase().indexOf('south') > -1) {
                        callback({ area: 'earth', level: 'downstairs'});
                    } else {
                        callback(null, {text: 'You can\'t GO there.  It either isn\'t a place, or you aren\'t where you think you are.'});
                    }
                }
            }
        }
    },
    downstairs : {
        message: {text: "You are now DOWNSTAIRS. MOM is in the kitchen, there is a table with chairs to the EAST and a DOOR to the SOUTH."},
        actions: {
            'get': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'There isn\'t anything to GET here. Need HELP? You just might...'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'Your curiosity will serve you well in the future.  For now though, there isn\'t much to LOOK AT.'});
                }
            },
            'talk': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('mom') > -1) {
                        //update freakin inventory

                        callback(null, {text: 'You got a SANDWICH, and JUICE BOX from MOM. USE these when your health gets low. They have been added to your INVENTORY.'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('door') > -1 || text.toLowerCase().indexOf('south') > -1) {
                        callback({area: 'earth', level: 'frontyard'});
                    } else {
                        callback(null, {text: 'That isn\'t a real place. Or it isn\'t a fake place. Matter of perspective.'});
                    }
                }
            }
        }
    },
    frontyard: {
        message: {text: 'You are in the FRONTYARD. There\'s a fence to the SOUTH and a large SPACESHIP to the EAST. Wait, that wasn\'t here yesterday.'},
        action: {
            'get': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'There\'s nothing to get here. See what\'s up with that SPACESHIP over there.'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('spaceship') > -1) {
                        callback(null, {text: 'Large, metal, looks like a nice SPACESHIP. I wonder if there\'s anything inside?'});
                    } else {
                        callback(null, {text: 'You try to look, but the SPACESHIP steals your gaze... Oooohhh... SPACESHIP....'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('spaceship') > -1) {
                        callback({area: 'earth', level: 'spaceship'});
                    } else if (text.toLowerCase().indexOf('east') > -1) {
                        callback(null, {text: 'You try to go EAST, but like we just told you, there\'s a freakin\' SPACESHIP there.'});
                    } else {
                        callback(null, {text: 'There\'s a SPACESHIP present, and that\'s where you want to go? This game might not be for you...'});
                    }
                }
            }
        }
    },
    spaceship: {
        message: {text: 'You are now inside the SPACESHIP! There are buttons on a DASHBOARD in front of you. What looks like lockers to the RIGHT.'},
        action: {
            'push': {
                synonyms: ['push', 'push button', 'press'],
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('red') > -1) {
                        callback({area: 'space', location: 'spaceship'});
                    } else if (text.toLowerCase().indexOf('blue') > -1) {
                        // this is where we need to call a you're dead function and explode the freakin ship and show a picture of the freakin exploded dead ship
                        callback(null, {text: 'BOOOOOOOOOOOM!!!!!!! YOU\'RE FREAKIN DEAD!!!!!!!!!!'});
                    } else {
                        callback(null, {text: 'Pushing that doesn\'t do anything immediate... Wait... No, nothing.'});
                    }
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('dashboard') > -1 || text.toLowerCase().indexOf('buttons') > -1) {
                        callback(null, {text: 'There are buttons and controls all over the place. A RED and BLUE button is glowing.'});
                    } else {
                        callback(null, {text: ''});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('') > -1) {
                        callback({area: 'earth', level: 'spaceship'});
                    }
                }
            }
        }
    }
};

module.exports = locations;
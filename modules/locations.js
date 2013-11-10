var locations = {};

locations.earth = {
    room : {
        message: {text: "You wake up in YOUR ROOM to a loud crash. It is a nice day out. There are some books to the WEST, and STAIRS to the SOUTH."},
        actions: {
            'get': {
                fn: function (user, text, callback) {
                    if (text.indexOf('books') > -1) {
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
                    if (text.indexOf('stairs') > -1 || text.indexOf('south') > -1) {
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
                    if (text.indexOf('mom') > -1) {
                        // TODO update freakin inventory

                        callback(null, {text: 'You got a SANDWICH, and JUICE BOX from MOM. USE these when your health gets low. They have been added to your INVENTORY.'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('door') > -1 || text.indexOf('south') > -1) {
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
        actions: {
            'get': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'There\'s nothing to get here. See what\'s up with that SPACESHIP over there.'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('spaceship') > -1) {
                        callback(null, {text: 'Large, metal, looks like a nice SPACESHIP. I wonder if there\'s anything inside?'});
                    } else {
                        callback(null, {text: 'You try to look, but the SPACESHIP steals your gaze... Oooohhh... SPACESHIP....'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('spaceship') > -1) {
                        callback({area: 'earth', level: 'spaceship'});
                    } else if (text.indexOf('east') > -1) {
                        callback(null, {text: 'You try to go EAST, but like we just told you, there\'s a freakin\' SPACESHIP there.'});
                    } else {
                        callback(null, {text: 'There\'s a SPACESHIP present, and that\'s where you want to go? This game might not be for you...'});
                    }
                }
            }
        }
    },
    spaceship: {
        message: {text: 'You are now inside the SPACESHIP! There is a DASHBOARD in front of you and what looks like LOCKERS to the RIGHT.'},
        actions: {
            'push': {
                synonyms: ['push', 'press'],
                fn: function (user, text, callback) {
                    if (text.indexOf('red') > -1) {
                        callback({area: 'spaceshipAlpha', location: 'level1'});
                    } else if (text.indexOf('blue') > -1) {
                        // TODO this is where we need to call a you're dead function and explode the freakin ship and show a picture of the freakin exploded dead ship
                        callback(null, {text: 'BOOOOOOOOOOOM!!!!!!! YOU\'RE FREAKIN DEAD!!!!!!!!!!'});
                    } else {
                        callback(null, {text: 'Pushing that doesn\'t do anything immediate... Wait... No... nothing.'});
                    }
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('dashboard') > -1) {
                        callback(null, {text: 'There are buttons and controls all over the place. A RED and BLUE button is glowing.'});
                    } else if (text.indexOf('lockers') > -1) {
                        callback(null, {text: 'Some futuristic looking LOCKERS. I wonder if there\'s anything useful inside?'});
                    } else {
                        callback(null, {text 'That isn\'t as interesting as some of the other things here. Try LOOKing AT something else.'});
                    }
                }
            },
            'open': {
                synonyms: ['open', 'explore'],
                fn: function (user, text, callback) {
                    if (text.indexOf('locker') > -1) {
                        callback(null, {text: 'There are SPACESUITs in here! And what looks like some kind of SAFE. Cool!'});
                    } else {
                        callback(null, {text: 'That doesn\'t open up. Not with the tools that you have now, anyways.'});
                    }
                }
            },
            'get': {
                fn: function (user, text, callback) {
                    if (text.indexOf('spacesuit') > -1) {
                        // TODO add freakin spacesuit to inventory
                        callback(null, {text: 'You\'ve acquired a SPACESUIT! Looks like this baby will let you breathe in SPACE!'});
                    } else if (text.indexOf('safe') > -1) {
                        callback(null, {text: 'That is waaaay too heavy to GET. Must be made out of some crazy inter-galactic element.'});
                    } else {
                        callback(null, {text: 'That isn\'t something to GET.'});
                    }
                }
            },
            'break': {
                synonyms: ['break', 'bust'],
                fn: function (user, text, callback) {
                    if (text.indexOf('safe') > -1) {
                        callback(null, {text: 'That is a SAFE from outerspace, man. Could you BREAK a SAFE on EARTH? Now your hand hurts.'});
                    } else {
                        callback(null, {text: 'Tough guy eh? Move along, you might hurt yourself.'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('space') > -1) {
                        callback(null, {text: 'How high can you jump? Probably not high enough to get to SPACE, man. Find another way.'});
                    } else {
                        callback(null, {text: 'There isn\'t really anywhere you can GO from here. Maybe see what this SPACESHIP is capable of.'})
                    }
                }
            }
        }
    }
};

locations.spaceshipAlpha = {
    level1 : {
        message: {text: 'The DOOR slams shut! Everything starts to rumble and you are pasted to the floor. Suddenly... you\'re in SPACE!'},
        actions: {
            'look': {
                synonyms: ['look'],
                fn: function (user, text, callback) {
                    callback(null, {text: 'Sweet. Space.'});
                }
            }
        }
    }
};

module.exports = locations;
var db = require('./db.js');
var locations = {};

locations.earth = {
    room : {
        message: {text: "You wake up in YOUR ROOM to a loud crash. It is a nice day out. There are some books to the WEST, and STAIRS to the SOUTH."},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You are in YOUR ROOM. It is probably time to start heading DOWNSTAIRS.'});
                }
            },
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
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You are DOWNSTAIRS. MOM is cooking something, but its always nice to talk to her. There is a DOOR to the SOUTH.'});
                }
            },
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
                        db.addInventoryItem(user.handle, [{name: 'sandwich', qty: 1, bonus: {hp: 10, off: 0, def: 0}}], function (err, saved) {
                            if (err) { 
                                callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                            } else if (saved) {
                                callback(null, {text: 'You got a SANDWICH from MOM. USE these when your health gets low. They have been added to your INVENTORY.'});
                            } else {
                                callback(null, {text: 'Your INVENTORY was modified. Type INVENTORY to view it.'});
                            }
                        });
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
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'Not much of interest going on in the FRONTYARD except that gigantic SPACESHIP.'});
                }
            },
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
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You are inside the SPACESHIP! The DASHBOARD looks overwhelming. Are those LOCKERS to the RIGHT?'});
                }
            },
            'push': {
                synonyms: ['push', 'press'],
                fn: function (user, text, callback) {
                    if (text.indexOf('red') > -1) {
                        callback({area: 'spaceshipAlpha', level: 'earthOrbit'});
                    } else if (text.indexOf('blue') > -1) {
                        // TODO this is where we need to call a you're dead function and explode the freakin ship and show a picture of the freakin exploded dead ship
                        callback(null, {text: 'BOOOOOOOOOOOM!!!!!!! YOU\'RE FREAKIN DEAD!!!!!!!!!! Just kidding, but try something else.'});
                    } else {
                        callback(null, {text: 'Pushing that doesn\'t do anything immediate... Wait... No... nothing.'});
                    }
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('dashboard') > -1) {
                        callback(null, {text: 'There are buttons and controls all over the place. A big touchscreen and A RED and BLUE button is glowing.'});
                    } else if (text.indexOf('lockers') > -1) {
                        callback(null, {text: 'Some futuristic looking LOCKERS. I wonder if there\'s anything useful inside?'});
                    } else {
                        callback(null, {text: 'That isn\'t as interesting as some of the other things here. Try LOOKing AT something else.'});
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
                        db.addInventoryItem(user.handle, [{name: 'spacesuit', qty: 1, bonus: {hp: 0, off: 0, def: 5}}], function (err, saved) {
                            if (err) { 
                                callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                            } else if (saved) {
                                callback(null, {text: 'You\'ve acquired a SPACESUIT! Looks like this baby will let you breathe in SPACE! You put it on.'});
                            } else {
                                callback(null, {text: 'Your INVENTORY might have been modified. Type INVENTORY to view it.'});
                            }
                        });
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
                        callback(null, {text: 'There isn\'t really anywhere you can GO from here. Maybe see what this SPACESHIP is capable of.'});
                    }
                }
            }
        }
    }
};

locations.spaceshipAlpha = {
    earthOrbit : {
        message: {text: 'The DOOR slams shut! Everything starts to rumble and you are pasted to the floor. Suddenly... you\'re in SPACE!'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'Outside is SPACE. A DASHBOARD is in front of you and the LOCKERS are still here too. The DOOR is sealed behind you.'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('dashboard') > -1) {
                        callback(null, {text: 'BUTTONS all over the place. A MONITOR with KEYBOARD is here that appears to be in English... Convenient...'});
                    } else if (text.indexOf('monitor') > -1) {
                        callback(null, {text: 'The monitor reads: \"Last Location: Earth-Moon, Current Location: Earth-Orbit, Destination: _\". And the cursor is blinking.'});
                    } else if (text.indexOf('keyboard') > -1) {
                        callback(null, {text: 'Not a standard English keyboard, but there are definitely some recognizable characters here. Can you TYPE?'});
                    } else if (text.indexOf('locker') > -1) {
                        callback(null, {text: 'The same lockers as before. That SAFE is still here, and a couple of spare SPACESUITS.'});
                    } else if (text.indexOf('door') > -1) {
                        callback(null, {text: 'This DOOR is sealed shut. There\'s a LEVER next to it, but it might not be best to PULL that out here.'});
                    } else {
                        callback(null, {text: 'Move along, there\'s nothing to see here.'});
                    }
                }
            },
            'type': {
                synonyms: ['type'],
                fn: function (user, text, callback) {
                    if (text.indexOf('moon') > -1) {
                        callback({area: 'moon', level: 'spaceshipClosed'});
                    } else if (text.indexOf('earth') > -1) {
                        callback(null, {text: 'Really? Had enough of SPACE already? GAME OVER man, you lose. Okay not really, try a different place though.'});
                    }
                    else {
                        callback(null, {text: 'The SPACESHIP didn\'t seem to recognize that input... Maybe try something its familiar with?'});
                    }
                }
            },
            'pull': {
                synonyms: ['pull'],
                fn: function (user, text, callback) {
                    if (text.indexOf('lever') > -1) {
                        callback(null, {text: 'You try to PULL the LEVER, but it doesn\'t budge. That is a nice feature, be thankful.'});
                    } else {
                        callback(null, {text: 'There is only one thing here you can pull, currently. This wasn\'t it...'});
                    }
                }
            },
            'get': {
                fn: function (user, text, callback) {
                    if (text.indexOf('spacesuit') > -1) {
                        // TODO add freakin spacesuit to inventory
                        db.userHasItem(user.handle, 'spacesuit', function (err, itemExists) {
                            if (itemExists) {
                                callback(null, {text: 'You already have one of these. That should be enough.'});
                            } else {
                                db.addInventoryItem(user.handle, [{name: 'spacesuit', qty: 1, bonus: {hp: 0, off: 0, def: 5}}], function (err, saved) {
                                    if (err) { 
                                        callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                                    } else if (saved) {
                                        callback(null, {text: 'You\'ve acquired a SPACESUIT! Looks like this baby will let you breathe in SPACE! You put it on.'});
                                    } else {
                                        callback(null, {text: 'Your INVENTORY might have been modified. Type STATUS to view it.'});
                                    }
                                });
                            }
                        });                        
                    } else if (text.indexOf('safe') > -1) {
                        callback(null, {text: 'That is waaaay too heavy to GET. Must be made out of some crazy inter-galactic element.'});
                    } else {
                        callback(null, {text: 'That isn\'t something to GET.'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'This is a one-room spaceship, there isn\'t really anywhere to go. Try interacting with somethingn else.'});
                }
            }
        }
    }
};

locations.moon = {
    spaceshipClosed: {
        message: {text: 'The ship speeds up and throws you to the floor again. After some rumbling, it appears we have landed somewhere.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'Looks like you\'ve landed on the moon. The door behind you is still shut but there is a LEVER next to it.'});
                }
            },
            'pull': {
                synonyms: ['pull'],
                fn: function (user, text, callback) {
                    if (text.indexOf('lever') > -1) {
                        db.userHasItem(user.handle, 'spacesuit', function (err, itemExists) {
                            if (itemExists) {
                                callback({area: 'moon', level: 'spaceshipOpen'});
                            } else {
                                callback(null, {text: 'The DOOR slides open and YOU DIE IMMEDIATELY. Okay, you don\'t. Is there something in here that will prevent that?'});
                            }
                        });
                    } else {
                        callback(null, {text: 'There is only one thing here you can pull, currently. This wasn\'t it...'});
                    }
                }
            },
            'get': {
                fn: function (user, text, callback) {
                    if (text.indexOf('spacesuit') > -1) {
                        // TODO add freakin spacesuit to inventory
                        db.userHasItem(user.handle, 'spacesuit', function (err, itemExists) {
                            if (itemExists) {
                                callback(null, {text: 'You already have one of these. That should be enough.'});
                            } else {
                                db.addInventoryItem(user.handle, [{name: 'spacesuit', qty: 1, bonus: {hp: 0, off: 0, def: 5}}], function (err, saved) {
                                    if (err) { 
                                        callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                                    } else if (saved) {
                                        callback(null, {text: 'You\'ve acquired a SPACESUIT! Looks like this baby will let you breathe in SPACE! You put it on.'});
                                    } else {
                                        callback(null, {text: 'Your INVENTORY might have been modified. Type STATUS to view it.'});
                                    }
                                });
                            }
                        });
                    } else if (text.indexOf('safe') > -1) {
                        callback(null, {text: 'That is waaaay too heavy to GET. Must be made out of some crazy inter-galactic element.'});
                    } else {
                        callback(null, {text: 'That isn\'t something to GET.'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('door') > -1) {
                        callback(null, {text: 'The DOOR still seems to be locked, maybe that LEVER next to it has something to do with that...'});
                    } else {
                        callback(null, {text: 'This is a one-room spaceship, there isn\'t really anywhere to go. Try interacting with somethingn else.'});
                    }
                }
            }
        }
    },
    spaceshipOpen: {
        message: {text: 'Sounds like some pressure was released. And the DOOR slides open revealing the porous, dry surface of the MOON.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You can see out of the SPACESHIP DOOR. Looks nice out there. EARTH can be seen in the distance.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('door') > -1) {
                        callback({area: 'moon', level: 'surface1'});
                    } else {
                        callback(null, {text: 'You\'ve got to get out of this SPACESHIP before you can GO anywhere.'});
                    }
                }
            }
        }
    },
    surface1: {
        message: {text: 'You step out onto the surface of the MOON. There is a light off in the distance to the WEST. More moon surface NORTH.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You are on the MOON. SPACESHIP is to the SOUTH, noise and light to the WEST, and more MOON to the NORTH and EAST.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('west') > -1) {
                        callback({area: 'moon', level: 'surface2'});
                    } else if (text.indexOf('south') > -1 || text.indexOf('spaceship') > -1) {
                        callback(null, {text: 'Let\'s not leave just yet... We just got here!'});
                    } else {
                        callback(null, {text: 'I don\'t really see any reason to go there.  Since I\'m running the show here, I say no.'});
                    }
                }
            }
        }
    },
    surface2: {
        message: {text: 'The light and noise to the WEST are more apparent. Your SPACESHIP is back EAST. Are those FOOTPRINTS heading NORTH?'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'Something is happening to the WEST, but these FOOTPRINTS are heading NORTH...'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('footprints') > -1) {
                        callback(null, {text: 'These don\'t look like human FOOTPRINTS. They are leading to the NORTH.'});
                    } else {
                        callback(null, {text: 'As you might try, you can\'t really LOOK AT that. Maybe its all the space dust...'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('west') > -1) {
                        callback({area: 'moon', level: 'surfaceCraterEdge'});
                    } else if (text.indexOf('north') > -1) {
                        callback({area: 'moon', level: 'moonMountain'});
                    } else {
                        callback(null, {text: 'Do you not have the hang of this by now? Try going SOMEWHERE ELSE.'});
                    }
                }
            }
        }
    },
    // this is where it will jump around a bit
    moonMountain: {
        message: {text: 'You follow the FOOTPRINTS. They lead you to the base of MOON MOUNTAIN. There looks like an ENTRANCE to the EAST.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You are at the base of MOON MOUNTAIN. Awesome. There is an ENTRANCE to the EAST.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('east') > -1 || text.indexOf('entrance') > -1) {
                        callback({area: 'moon', level: 'innerMoonMountain'});
                    } else {
                        callback(null, {text: 'That isn\'t a place that you can GO right now. Can you think of a more obvious location?'});
                    }
                }
            }
        }
    },
    innerMoonMountain: {
        message: {text: 'You walk into MOON MOUNTAIN. There is a rumble and the ENTRANCE is sealed by MOON ROCKS! You are in some sort of arena.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'It looks like a battle took place here recently. Blood, guts, and dust cover the ground. A SHINY OBJECT is exposed.'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('object') > -1) {
                        callback(null, {text: 'A SHINY OBJECT is half exposed in the ground. Looks like a KEY or other miscellaneous object.'});
                    } else if (text.indexOf('guts') > -1) {
                        callback(null, {text: 'Looks like freakin ALIEN GUTS! SIIIICCCCKKKKKK!'});
                    } else {
                        callback(null, {text: 'Move along now, nothing to see here.'});
                    }
                }
            },
            'get': {
                fn: function (user, text, callback) {
                    if (text.indexOf('key') > -1 || text.indexOf('object') > -1) {
                        db.addInventoryItem(user.handle, [{name: 'safe key', qty: 1, bonus: {hp: 0, off: 0, def: 0}}], function (err, saved) {
                            if (err) { 
                                callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                            } else if (saved) {
                                callback(null, {text: 'You\'ve acquired a SAFE KEY! Also, what luck, you see an EXIT to the EAST.'});
                            } else {
                                callback(null, {text: 'Your INVENTORY might have been modified. Also, what luck, you see an EXIT to the EAST.'});
                            }
                        });
                    } else {
                        callback(null, {text: 'That isn\'t something you can GET. Try GETting this game...'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('east') > -1 || text.indexOf('exit') > -1) {
                        callback({area: 'moon', level: 'postMoonMountain'});
                    } else {
                        callback(null, {text: 'That isn\'t a place that you can GO right now. Did you see that EXIT through the MOON DUST?'});
                    }
                }
            }
        }
    },
    postMoonMountain: {
        message: {text: 'It was a relief getting out of that MOON MOUNTAIN. A storm seems to be picking up. You see your SPACESHIP to the SOUTH.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'Can\'t see much with this storm picking up. You can however, see your SPACESHIP back to the SOUTH.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('south') > -1 || text.indexOf('spaceship') > -1) {
                        callback({area: 'moon', level: 'spaceshipAfterMountain'});
                    } else {
                        callback(null, {text: 'That isn\'t a place that you can GO right now. Did I mention you can see your SPACESHIP?'});
                    }
                }
            }
        }
    },
    spaceshipAfterMountain: {
        message: {text: 'Back in the comfort of the SPACESHIP. Usual SPACESHIP stuff is around.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'I guess you forgot... There is a DASHBOARD in front of you, LOCKERS to your RIGHT and a DOOR behind you.'});
                }
            },
            'look at': {
                fn: function (user, text, callback) {
                    if (text.indexOf('dashboard') > -1) {
                        callback(null, {text: 'BUTTONS all over the place. A MONITOR with KEYBOARD is here that appears to be in English... Convenient...'});
                    } else if (text.indexOf('monitor') > -1) {
                        callback(null, {text: 'The monitor reads: \"Last Location: Earth-Orbit, Current Location: Earth-Moon, Destination: _\". And the cursor is blinking.'});
                    } else if (text.indexOf('keyboard') > -1) {
                        callback(null, {text: 'Not a standard English keyboard, but there are definitely some recognizable characters here. Can you TYPE?'});
                    } else if (text.indexOf('locker') > -1) {
                        callback(null, {text: 'The same lockers as before. That SAFE is still here, and a couple of spare SPACESUITS.'});
                    } else if (text.indexOf('door') > -1) {
                        callback(null, {text: 'This DOOR is shut. There\'s a MOON out there...'});
                    } else {
                        callback(null, {text: 'Move along, there\'s nothing to see here.'});
                    }
                }
            },
            'open': {
                synonyms: ['open', 'unlock'],,
                fn: function (user, text, callback) {
                    if (text.indexOf('safe') > -1) {
                        db.addInventoryItem(user.handle, [{name: 'sword', qty: 1, bonus: {hp: 0, off: 50, def: 0}}], function (err, saved) {
                            if (err) { 
                                callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                            } else {
                                callback(null, {text: 'The SAFE swings open revealing THE SWORD OF THE UNIVERSE! You are now weilding it!'});
                            }
                        });
                    } else {
                        callback(null, {text: 'That isn\'t something you can OPEN. Sorry.'});
                    }
                }
            },
            'type': {
                synonyms: ['type'],
                fn: function (user, text, callback) {
                    if (text.indexOf('earth') > -1) {
                        callback(null, {text: 'It\'s trying, But nothing happens. The MONITOR reads: \"Ship needs FLUX CAPACITOR to go there.\" Better go exploring.'});
                    } else {
                        callback(null, {text: 'The SPACESHIP didn\'t seem to recognize that input.'});
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('door') > -1) {
                        callback({area: 'moon', level: 'surface3'});
                    } else {
                        callback(null, 'You shall not pass.');
                    }
                }
            }
        }
    },
    surface3: {
        message: {text: 'Back on the MOON. Noise and Light still to the WEST.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You are on the MOON. SPACESHIP is to the SOUTH, noise and light to the WEST, and more MOON to the NORTH and EAST.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('west') > -1) {
                        callback({area: 'moon', level: 'surfaceCraterEdge'});
                    } else {
                        callback(null, {text: 'I don\'t really see any reason to go there.  Since I\'m running the show here, I say no.'});
                    }
                }
            }
        }
    },
    surfaceCraterEdge: {
        message: {text: 'You come to the edge of a crater. There is a large MOON MONSTER at the BOTTOM. He seems to be guarding a large metal object.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'That MOON MONSTER must have been responsible for all that noise and light. He is SOUTH to the BOTTOM of the crater.'});
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.indexOf('bottom') > -1 || text.indexOf('south') > -1) {
                        callback({area: 'moon', level: 'craterBottom'});
                    } else {
                        callback(null, {text: 'That isn\'t a real place. Or it isn\'t a fake place. Matter of perspective.'});
                    }
                }
            }
        }
    },
    craterBottom: {
        message: {text: 'You get to the BOTTOM of the crater. The MOON MONSTER is staring you down. He is huge and ugly and upset about something.'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'MOON MONSTER is in front of you. That is a FLUX CAPACITOR he is guarding. You\'ll need that to get home.'});
                }
            },
            'fight': {
                synonyms: ['fight', 'attack', 'kill', 'engage'],
                fn: function (user, text, callback) {
                    if (text.indexOf('monster') > -1) {
                        db.userHasItem(user.handle, 'sword', function (err, itemExists) {
                            if (itemExists) {
                                db.addInventoryItem(user.handle, [{name: 'flux', qty: 1, bonus: {hp: 0, off: 50, def: 0}}], function (err, saved) {
                                    if (err) { 
                                        callback(null, {text: 'You were supposed to get an item. We don\'t think you did. Sorry about your luck.'});
                                    } else {
                                        callback(null, {text: 'You sliced the MONSTER in half with the SWORD OF THE UNIVERSE! You got the FLUX CAPACITOR! SPACESHIP will take you home!'});
                                    }
                                });
                            } else {
                                callback({area: 'moon', level: 'dead'});
                            }
                        }
                    } else {
                        callback(null, {text: 'You can\'t fight whatever it is you\'re trying to fight you freakin hothead.'});
                    }
                }
            },
            'spaceship': {
                synonyms: ['spaceship'],
                fn: function (user, text, callback) {
                    callback({area: 'moon', level: 'endgame'});
                }
            }
        }
    },
    dead: {
        message: {text: 'You died because you didn\'t have any weapon to fight the MOON MONSTER with. Type GO to go back and correct your errors.'},
        actions: {
            'go': {
                fn: function (user, text, callback) {
                    callback({area: 'moon', level: 'surface2'});
                }
            }
        }
    },
    endgame: {
        message: {text: 'The SWORD OF THE UNIVERSE teleports you back to the SPACESHIP. This thing is headed home. Thanks for playing!'},
        actions: {
            'look around': {
                fn: function (user, text, callback) {
                    callback(null, {text: 'You look like a champion. Check out http://polar-badlands.2013.nodeknockout.com if you had a good time!'});
                }
            }
        }
    }
};

module.exports = locations;
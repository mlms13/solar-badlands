var locations = {};

locations.earth = {
    room : {
        message: "You wake up in YOUR ROOM to a loud crash. It is a nice day out. There are some books to the WEST, and STAIRS to the SOUTH.",
        actions: {
            'get': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('books') > -1) {
                        callback(null, 'These sure do look interesting, but you don\'t have any use for them now.');
                    } else {
                        callback(null, 'You can\'t GET that. Try doing something else, or asking for HELP.');
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('stairs') > -1) {
                        callback({ area: 'earth', level: 'downstairs'});
                    } else {
                        callback(null, 'You can\'t GO there.  It either isn\'t a place, or you aren\'t where you think you are.');
                    }
                }
            }
        }
    },
    downstairs : {
        message: "You are now DOWNSTAIRS. MOM is in the kitchen, there is a table with chairs to the EAST and a DOOR to the SOUTH.",
        actions: {
            'get': {
                fn: function (user, text, callback) {
                    callback(null, 'There isn\'t anything to GET here. Need HELP? You just might...');
                }
            },
            'talk': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('mom') > -1) {
                        //update freakin inventory

                        callback(null, 'You got a SANDWICH, and JUICE BOX from MOM. USE these when your health gets low. They have been added to your INVENTORY.');
                    }
                }
            },
            'go': {
                fn: function (user, text, callback) {
                    if (text.toLowerCase().indexOf('door') > -1) {
                        callback({area: 'earth', level: 'frontyard'});
                    } else {
                        callback(null, 'That isn\'t a real place. Or it isn\'t a fake place. Matter of perspective.');
                    }
                }
            }
        }
    }
};

module.exports = locations;
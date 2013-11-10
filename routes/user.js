var db = require('../modules/db.js');

// GET everything for the base /user page
exports.renderForm = function (req, res) {
    res.render('user-search');
};

// POST to the /user page
exports.submit = function (req, res) {
    var handle = req.param('tw-handle');
    handle = handle.indexOf("@") === 0 ? handle.slice(1) : handle;

    db.getUser(handle, function (err, user) {
        if (err) {
            res.render('user-search', {error: {title: "Troubles!", body: "We had some problems connecting to the database."}});
            return;
        }
        if (user) {
            res.redirect('/user/' + handle);
        } else {
            res.render('user-search', {error: {title: "User not found!", body: "Are you sure the user has started a game?"}});
        }
    });
};

// GET all activity for the given user
exports.show = function(req, res) {
    // get a user based on the handle in the URL
    db.getUser(req.params.handle, function (err, user) {
        if (err) {
            res.render('user', {error: {title: "Troubles!", body: "We had some problems connecting to the database."}});
            return;
        }
        if (!user) {
            res.render('user-search', {error: {title: "User not found!", body: "Are you sure the user has started a game?"}});
        } else {
            // we found a user, so let's retrieve their log
            db.getUserLog(req.params.handle, function (err, log) {
                if (err || !log) {
                    res.render('user', {error: {title: "Troubles!", body: "We had some problems connecting to the database."}});
                    return;
                }
                // or, if nothing went wrong, finally load the actual page
                res.render('user', {userImage: user.twImage, history: log.history});
            });
        }
    });
};
var db = require('../modules/db.js');

// GET all activity for the given user
exports.show = function(req, res) {
    // get user log based on req.params.handle
    db.getUserLog(req.params.handle, function (err, log) {
        if (err) {
            res.render('user', {error: {title: "Troubles!", body: "We had some problems connecting to the database."}});
            return;
        }
        if (!log) {
            // TODO don't just render the index page here
            // instead, split the user-search into its own jade file
            // and `include` it everywhere that it would be useful.
            // Maybe redirect to the /user page, which will have a search form as well
            res.render('index', {error: {title: "User not found!", body: "Are you sure the user has started a game?"}});
        } else {
             res.render('user', {history: log.history});
        }
    });
};
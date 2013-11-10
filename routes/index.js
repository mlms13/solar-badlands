var db = require('../modules/db.js');

// GET home page
exports.render = function(req, res) {
    res.render('index');
};

// POST to home page
exports.submit = function (req, res) {
    var handle = req.param('tw-handle');
    handle = handle.indexOf("@") === 0 ? handle.slice(1) : handle;

    db.getUser(handle, function (err, user) {
        if (err) {
            res.render('index', {error: {title: "Troubles!", body: "We had some problems connecting to the database."}});
            return;
        }
        if (user) {
            res.redirect('/user/' + handle);
        } else {
            res.render('index', {error: {title: "User not found!", body: "Are you sure the user has started a game?"}});
        }
    });
}
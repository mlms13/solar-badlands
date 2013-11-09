// GET home page
exports.render = function(req, res) {
    res.render('index');
};

// POST to home page
exports.submit = function (req, res) {
    var handle = req.param('tw-handle');
    handle = handle.indexOf("@") === 0 ? handle.slice(1) : handle;

    res.redirect('/user/' + handle);
}
// i think for heroku we can get on without this
// var isProduction = (process.env.NODE_ENV === 'production');
var express = require('express');
var index = require('./routes/index.js');
var about = require('./routes/about.js');
var user = require('./routes/user.js');
var help = require('./routes/help.js');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');
//var port = (isProduction ? 80 : 8000);
var port = process.env.PORT || 3000;

// clients
var twitter = require('./clients/twitter.js');

// set up app
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

app.use(lessMiddleware({
  src: __dirname + '/public/less',
  dest: __dirname + '/public/css',
  prefix: '/css',
  compress: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Set up the basic website routes
app.get('/', index.render);
app.get('/about', about.render);
app.get('/user', user.renderForm);
app.post('/user', user.submit);
app.get('/user/:handle', user.show);
app.get('/help', help.render);

twitter.startClient();

app.listen(port, function () {
    console.log('Static web server running on port ' + port);
});

// Start the HTTP server
// NODE KNOCKOUT STUFF, lets see if we can do without it?
// http.createServer(app).listen(port, function(err) {

//     if (err) { console.error(err); process.exit(-1); }

//     // if run as root, downgrade to the owner of this file
//     if (process.getuid && process.getuid() === 0) {
//         require('fs').stat(__filename, function(err, stats) {
//             if (err) { return console.error(err); }
//             process.setuid(stats.uid);
//         });
//     }

//     console.log('Server running at http://0.0.0.0:' + port + '/');
// });

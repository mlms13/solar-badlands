// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('tojaOcb0vsxbdxU0');

var isProduction = (process.env.NODE_ENV === 'production');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var db = require('./modules/db.js');
var twitter = require('./modules/twitter.js');
var port = (isProduction ? 80 : 8000);

var app = express();

var config = require('./config.js');

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
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

twitter.stream.on('tweet', function (tweet) {
  if (tweet.text.indexOf("@solarbadlands") === 0) {
    console.log(tweet.user.screen_name + " said: " + tweet.text.replace('@solarbadlands', ''));
  } else {
    console.log('Something happened, but we don\'t care about it.');
  }
});

http.createServer(app).listen(port, function(err) {

  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid && process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});

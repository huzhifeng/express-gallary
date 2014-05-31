
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var hbs = require('express-hbs');

var app = express();
app.engine('hbs', hbs.express3({
  defaultLayout: __dirname + '/views/layout.hbs',
  partialsDir: __dirname + '/views/partials'
}));

// all environments
app.set('port', process.env.PORT || 3344);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/gallary/random', routes.random);
app.get('/gallary', routes.gallary);
app.get(/\/gallary\/(.*)/, routes.gallary);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

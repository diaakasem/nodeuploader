
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var AttachmentFileRouter = require('./routes/attachmentFileRoutes').AttachmentFileRouter;
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var path = require('path');
var config = {
    attachDir: path.join('.', 'uploads'),
    attachUrl: '/attachFile'
};
app.logger = {
    error: function(msg) {
        console.log('error:' +msg);
    }
};

var attachmentsRouter = new AttachmentFileRouter(app, config);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

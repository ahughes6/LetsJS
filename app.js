var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/object');

var app = express();

// set up http server with socket.io and expose
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.set('server', server);

// init players
var players = require('./player');

// start gameloop
var gameloop = require('./gameloop');
gameloop.start();
//gameloop.callbacks.push(function() { io.sockets.emit('state', gameloop.objects) });

// set up socket.io
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  socket.on('flap', function () {
    try {
      gameloop.objects[socket.id].v.y = -350;
    } catch (e) {
    }
  });
  socket.on('join', function (data) {
    players.add(socket, data.nick, function() {
      socket.emit('die', {});
    });
    io.sockets.emit('players', players.getList());
  });
  socket.on('state', function() {
    socket.emit('state', gameloop.objects);
  });
  socket.on('leave', function (data) {
    players.remove(socket);
    io.sockets.emit('players', players.getList());
  });
  socket.on('disconnect', function () {
    players.remove(socket);
    io.sockets.emit('players', players.getList());
  });

  socket.emit('players', players.getList());
  socket.emit('state', gameloop.objects);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

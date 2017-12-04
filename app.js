
// Normal Express requires...
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var session = require("client-sessions");

// Set the views directory
app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'ejs');
// Log requests
app.use(morgan('tiny'));
//sessions
app.use(session({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: 'ASDfd223lasdF2k9S2;l!2asd;af)O', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, session will be extended by activeDuration milliseconds
}));

// app.use(expressSessions)
// parse application/x-www-form-urlencoded, with extended qs library
app.use(bodyParser.urlencoded({ extended: true }));

// Load all routes in the routes directory
fs.readdirSync('./routes').forEach(function (file){
  // There might be non-js files in the directory that should not be loaded
  if (path.extname(file) == '.js') {
    console.log("Adding routes in "+file);
    require('./routes/'+ file).init(app);
    }
});
// Handle static files
app.use(express.static(__dirname + '/public'));

//catch unhandled routes w error msg
app.use(function(req, res) {
    var message = 'Error, did not understand path '+req.path;
    // Set the status to 404 not found, and render a message to the user.
    res.status(404).render('error', { 'message': message });
});


var httpServer = http.Server(app);
var sio =require('socket.io');
var io = sio(httpServer);
httpServer.listen(50000, function() {console.log('Listening on 50000');});

require('./sockets/serverSocket.js').init(io);



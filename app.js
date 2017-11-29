
// Normal Express requires...
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

// Set the views directory
app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'ejs');
// Log requests
app.use(morgan('tiny'));




// This is where your normal app.get, app.put, etc middleware would go.

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

/* 
 * This section is pretty typical for setting up socket.io.
 *
 * 1) it is necessary to link socket.io to the same http-layer
 * server that Express is running in.  In other words, you can think
 * of Express as a higher-level server running on a lower-level
 * http layer.  You need to get a reference to that http-layer server
 * (the variable httpServer) that Express is using (variable app).
 *
 * 2) Then require socket.io
 * 3) Give socket.io the reference to the same the underlying http server
 * that  Express is using.
 * 4) Start the httpServer listening for both Express and socket.io
 *
 * This can be essentially reused as boilerplate for setting up socket.io
 * alongside Express.
 */

/*1*/ var httpServer = http.Server(app);
/*2*/ var sio =require('socket.io');
/*3*/ var io = sio(httpServer);
/*4*/ httpServer.listen(50000, function() {console.log('Listening on 50000');});

require('./sockets/serverSocket.js').init(io);



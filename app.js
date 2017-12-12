
// Normal Express requires...

var http = require('http');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

// Set the views directory
app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'ejs');


// Log requests
app.use(morgan('tiny'));

// parse application/x-www-form-urlencoded, with extended qs library
app.use(bodyParser.urlencoded({ extended: true }));


app.set('passport',require('./models/authenticate.js').init(app));

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

require('./routes/dbRoutes.js').initSockets(io);



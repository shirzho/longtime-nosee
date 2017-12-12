
var mongoModel = require('../models/mongoModel.js');
var NSP = null //dynamic namespace setter
exports.NSP = NSP;
exports.init = function(app){
    var passport = app.get('passport');

    app.get('/', index); // The login page currently, misleading name lol
    
    //app.get('/live_cards', live_cards);
   
    app.get('/home',checkAuthentication, homePath);
    app.get('/live_cards', checkAuthentication,liveCardsPath);
   
    app.get('/login', function(req,res){
      res.render('login');
    })
    app.post('/login_auth',
            passport.authenticate('local', {
                                    failureRedirect: '/login',
                                    successRedirect: '/home'}));
    // The Logout route
    app.get('/logout', doLogout);

    // The collection parameter maps directly to the mongoDB collection
    app.put('/:collection', doCreate); // CRUD Create
    app.get('/:collection', doRetrieve); // CRUD Retrieve
    app.post('/:collection', doUpdate); // CRUD Update
    app.delete('/:collection', doDelete); // CRUD Delete
};

/********** page routes *******************************************************
 */ 
index = function(req,res){
  //console.log(req.session.user);
  res.render('index'); 
};

// home = function(req, res){
//   res.render('home');
// }

// Members Only path handler
homePath = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be defined, but be careful anyway.
  if (req.user.pwd && req.user.username) {
    // Render the membership information view
    res.render('home');
  } else {
    // Render an error if, for some reason, req.user.displayName was undefined 
    res.render('error', { title: 'error!',obj: 'Application error...' });
  }
};

liveCardsPath = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be defined, but be careful anyway.
  if (req.user.pwd && req.user.username) {
    // Render the membership information view
    res.render('live_cards');
  } else {
    // Render an error if, for some reason, req.user.displayName was undefined 
    res.render('error', { title: 'error!',obj: 'Application error...' });
  }
};

function checkAuthentication(req, res, next){
    console.log("inside checkAuthentication");
    // Passport will set req.isAuthenticated
    if(req.isAuthenticated()){
        // call the next bit of middleware
        //    (as defined above this means doMembersOnly)
        next();
    }else{
        // The user is not logged in. Redirect to the login page.
        res.redirect("/login");
    }
}

/* 
 * Log out the user
 */
function doLogout(req, res){
  // Passport puts a logout method on req to use.
  req.logout();
  // Redirect the user to the welcome page which does not require
  // being authenticated.
  res.redirect('/');
};

/********** CRUD Create *******************************************************
 * Take the object defined in the request body and do the Create
 * operation in mongoModel.  (Note: The mongoModel method was called "insert"
 * when we discussed this in class but I changed it to "create" to be
 * consistent with CRUD operations.)
 */ 
doCreate = function(req, res){
    
    /*
    * First check if req.body has something to create.
    * Object.keys(req.body).length is a quick way to count the number of
    * properties in the req.body object.
    */
    if (Object.keys(req.body).length == 0) {
        res.render('message', {title: 'Mongo Demo', obj: "No create message body found"});

        return;
    }
    /*
    * Call the model Create with:
    *  - The collection to do the Create into
    *  - The object to add to the model, received as the body of the request
    *  - An anonymous callback function to be called by the model once the
    *    create has been successful.  The insertion of the object into the 
    *    database is asynchronous, so the model will not be able to "return"
    *    (as in a function return) confirmation that the create was successful.
    *    Consequently, so that this controller can be alerted with the create
    *    is successful, a callback function is provided for the model to 
    *    call in the future whenever the create has completed.
    */
    else{
      if (req.params.collection == "livecards"){
      //var exists = null;
      //check if requested user exists in Users collection
      mongoModel.findByUsername("users",req.body.username, function(err, foundUser) {
        if (err) { return false; };
        if (foundUser){
          console.log("foundUser in livecards create method "+ JSON.stringify(foundUser));
          var newData = {"pair": [req.body.username, req.user.username]};
          console.log('newData ', newData);
          //check that user pair doesn't exist inside livecards yet
          mongoModel.checkLivecardPair("livecards", req.body.username, req.user.username, function(status){
            NSP = req.body.username+req.user.username;
            console.log("NSP "+ NSP);
            console.log("this is the status"+status);
            if(!status){
              mongoModel.create ( req.params.collection, 
              newData,
                function(result) {
                    console.log("creating new userpair document in livecard collection!")
                    var success = (result ? "Create successful" : "Create unsuccessful");
                    res.render('message', {title: 'Mongo Demo', obj: success});
                });
            }else{
              res.render('message', {title: 'Mongo Demo', obj: "No create message body found"});
              console.log("user already exists"); 
            }
          });
        } 
      });
        
    }else{ //for users collection
      mongoModel.create ( req.params.collection, 
      req.body,
        function(result) {
            console.log("THIS IS REQ BODY "+JSON.stringify(req.body));
            // result equal to true means create was successful
            var success = (result ? "Create successful" : "Create unsuccessful");
            res.render('message', {title: 'Mongo Demo', obj: success});
            console.log("2. Done with callback in dbRoutes create");
    });
    }
  }
};

/********** CRUD Retrieve (or Read) *******************************************
 * Take the object defined in the query string and do the Retrieve
 * operation in mongoModel.
 */ 

doRetrieve = function(req, res){
  /*
   * Call the model Retrieve with:
   *  - The collection to Retrieve from
   *  - The object to lookup in the model, from the request query string
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the retrieve has been successful.
   * modelData is an array of objects returned as a result of the Retrieve
   */
   //console.log("this is query " + JSON.stringify(req.query));

    mongoModel.retrieve(
        req.params.collection, 
        req.query,
        function(modelData) {
          //console.log("MODELDATA" + modelData.length);
            if (modelData.length) {
                res.render('user_data',{obj: modelData});
            } else {
                var message = "No documents with "+JSON.stringify(req.query)+ 
                      " in collection " +req.params.collection+" found.";
                res.render('error', {title: 'ERRoR', obj: message});
            }
    });
}

/********** CRUD Update *******************************************************
 */ 
doUpdate = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var filter = {"username": req.body.filter};//req.body.find ? JSON.parse(req.body.find) : {};
  console.log("DSKFJDSLKJFL "+ JSON.stringify(filter));
  
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.render('error', {title:'Error', obj:'this did not work sos'});
    return;
  }
  var update =   {"$set":{"firstname":req.body.update}};//JSON.parse(req.body.update);

  console.log("THIS IS REQ BODY:" +JSON.stringify(req.body));
  /*
   * Call the model Update with:
   *  - The collection to update
   *  - The filter to select what documents to update
   *  - The update operation
   *    E.g. the request body string:
   *      find={"name":"pear"}&update={"$set":{"leaves":"green"}}
   *      becomes filter={"name":"pear"}
   *      and update={"$set":{"leaves":"green"}}
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the update has been successful.
   */
  mongoModel.update(  req.params.collection, filter, update,
                          function(status) {
                              res.render('message',{title:'SOS PLS WORK',obj: status});
                          });
}

/********** CRUD Delete *******************************************************
 * The delete route handler is left as an exercise for you to define.
 */
doDelete = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  // if there no update operation defined, render an error page.
  console.log("deleting: "+JSON.stringify(req.body));

  mongoModel.delete(req.params.collection, 
      req.body,
      function(result) {
      var success = (result ? "Delete successful" : "Delete unsuccessful");
      res.render('message', {title: 'Mongo Demo', obj: success});
      });
}

/********** SERVER SOCKET  *******************************************************
 */
//namespace checker function
function checkNSP(nspVar){
  if(nspVar){
    return nspVar;
  }else{
    return "test";
  }
}
exports.initSockets = function(io) {
    var currentPlayers = 0; // keep track of the number of players
    var msg;
    var seconds=0;
  // When a new connection is initiated
    io.sockets.on('connection', function (socket) {
        
    });

    //changing namespace between user pair
    var user_nsp = io.of('/'+checkNSP(NSP));
    user_nsp.on('connection', function(socket){
        ++currentPlayers;

        socket.emit('players', { number: currentPlayers});
        socket.broadcast.emit('players',{number: currentPlayers});
        socket.emit('welcome', {welcome_msg: "Welcome user, "+currentPlayers});


        socket.on( 'sending_chat', function(txt){
            socket.broadcast.emit('sending_chat', txt);
            socket.emit('sending_chat', txt);
        });
        
        socket.on('live_write', function(data){
            writing = data.text;
            console.log("writing on serverSocket: "+writing);
            socket.broadcast.emit('live_write',{text: writing});
            socket.emit('live_write', {text: writing});
        });
        //disconnect     
        socket.on('disconnect', function () {
            --currentPlayers;
            socket.emit('players', { number: currentPlayers});
            socket.broadcast.emit('players', { number: currentPlayers});
            socket.broadcast.emit('welcome', {welcome_msg: "Welcome player, "+currentPlayers});
        });
        
    });
}















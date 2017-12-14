
var mongoModel = require('../models/mongoModel.js');

exports.init = function(app){
    var passport = app.get('passport');

    app.get('/', index); // The login page currently, misleading name lol
    
    //app.get('/live_cards', live_cards);
    app.get('/register', function(req,res){
      res.render('register');
    })
    app.get('/home', checkAuthentication, homePath);
    //app.get('/home', function(req,res){res.render('home')});
    app.get('/live_cards', checkAuthentication,liveCardsPath);
    //app.get('/live_cards', function(req,res){res.render('live_cards')});
    app.get('/new_live_card', checkAuthentication,newCardPath);
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

newCardPath = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be defined, but be careful anyway.
  if (req.user.pwd && req.user.username) {
    // Render the membership information view
    res.render('new_live_card');
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
      //for livecards collection only (change pair from just buddyName to [buddyname, yourname] sorted)
      if (req.params.collection == "livecards"){
        var userPair = [req.user.username, req.body.pair]
        userPair = userPair.sort();
        req.body.pair = userPair;
      };
        
      //for users and livecards collections
      mongoModel.create ( req.params.collection, req.body,
        function(result) {
            // result equal to true means create was successful
            var success = (result ? "Create successful" : "Create unsuccessful");
            res.render('message', {title: 'Mongo Demo', obj: success});
        });
    }
};

/********** CRUD Retrieve (or Read) *******************************************
 * Take the object defined in the query string and do the Retrieve
 * operation in mongoModel.
 */ 

doRetrieve = function(req, res){
  
  //change req.query if collection is livecards
  if(req.params.collection=="livecards" && req.query.pair){
    var userPair = [req.user.username, req.query.pair]
    userPair = userPair.sort();
    req.query = {"pair" : userPair};
  }
  mongoModel.retrieve(req.params.collection, req.query,
      function(modelData) {
          if (modelData.length && req.query.pair) {
              res.render('card_data',{obj: modelData});
          }else if(modelData.length && req.query.cardName){
              res.render('edit_card',{obj: modelData});
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
  
  
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.render('error', {title:'Error', obj:'this did not work sos'});
    return;
  }

  if (req.params.collection=="users"){
    var filter = {"username": req.body.filter};//req.body.find ? JSON.parse(req.body.find) : {};
    var update =   {"$set":{"firstname":req.body.update}};//JSON.parse(req.body.update);
  }else{
    if (req.params.collection=="livecards" && req.body.update.cardName){
    
    var key = req.body.update.cardName
    var update = {"$set":{cardContent: req.body.update.card, cardName : req.body.update.cardName}};
    var newFilter = [req.user.username, req.body.filter]
    newFilter = newFilter.sort();
    var filter = {"pair": newFilter};
  }else{
    var update = {"$set":{cardContent: req.body.update}};
    var filter = {"cardName": req.body.filter};
  }
  }
  
  
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

  mongoModel.delete(req.params.collection, 
      req.body,
      function(result) {
      var success = (result ? "Delete successful" : "Delete unsuccessful");
      res.render('message', {title: 'Mongo Demo', obj: success});
      });
}


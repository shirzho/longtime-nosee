/* 
 * This simple controller is to demonstrate the use of Passport.
 * There are two primary routes: 
 * 1) "/" - Does not require the user to authenticate (log in).
 * 2) "/membersOnly".  This does require autentication
 * And there are two supporting routes to log in and out (with obvious names).
 */

/* 
 * Initialize this controller
 * @param {Express} app - The Express app
 */
exports.init = function(app) {
  // app.js put the Passport object on the Express object so we could get it 
  // handily here.  Note that this form of app.get is NOT a route, rather it is
  // a getter to go along with a prior setter.
  var passport = app.get('passport');
  // Welcome page route
  


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
}

// No path:  display the welcome page
index = function(req, res) {
  res.render('index');
};

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
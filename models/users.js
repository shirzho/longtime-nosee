exports.findByUsername = function(username, callback) {
  var foundUser = null;
  /*
   * Err would be used if there was an error communicating with the database
   * This is different than not finding a User, which is a normal possibility
   * Since my example is just using an array, an error won't happen.
   * Your user information should be saved in a database.
   */
  var err = null;
  // search for the user with a given username
  // for (var i = 0 ; i < users.length ; i++) {
  //   if (users[i].username == username) {
  //     foundUser = users[i];
  //     break;
  //   }
  // }
  /*
   * Call the given callback function with err and the foundUser
   * err may be null (no error connecting to database)
   * and foundUser also null if no user by this name is found
   */
  callback(err, foundUser);
}

exports.findById = function(id, callback) {
  var foundUser = null;
  /*
   * Err would be used if there was an error communicating with the database
   * This is different than not finding a User, which is a normal possibility
   * Since my example is just using an array, an error won't happen.
   * Your user information should be saved in a database.
   */
  var err = null;
  // search for the user with a given id
  for (var i = 0 ; i < users.length ; i++) {
    if (users[i].id == id) {
      foundUser = users[i];
      break;
    }
  }
  /*
   * Call the given callback function with err and the foundUser
   * err may be null (no error connecting to database)
   * and foundUser also null if no user by this name is found
   */
  callback(err, foundUser);
}
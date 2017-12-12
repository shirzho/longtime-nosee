var mongoClient = require('mongodb').MongoClient;

var connection_string = 'mongodb://shirley:shirley@ds155820.mlab.com:55820/longtimenosee';
var blah = 'mongodb://shirley:shirley@ds155820.mlab.com:55820/longtimenosee'


// Global variable of the connected database
var mongoDB; 

mongoClient.connect(connection_string, function(err, db) {
  if (err) doError(err);
  console.log("Connected to MongoDB server at: "+connection_string);
  mongoDB = db; // Make reference to db globally available.
});
//this is a method to generate a namespace name based off of two usernames


//check for existing livecard pairs method
exports.checkLivecardPair = function(collection, user1, user2, callback){
  
  console.log("inside checklivecard method in mongomodels");
  mongoDB.collection(collection).findOne({"pair": [user1, user2]}, function(err,doc){
    //or {'pair':[req.user.username, req.body.username]}
      console.log("DOC: "+doc);
      if (err) doError(err);
      console.log("this is error: "+ err);
      if (doc==null || doc.length==0) {
        console.log("checking reverse user pair");
        mongoDB.collection("livecards").findOne({"pair": [user2, user1]}, function(err, doc){
        if (err) doError(err);
        console.log("this is error: part 2 "+ err);

        });
        
      }
    callback(doc);
    });

}
/********** authentication methods ***************************************
 */

 exports.findByUsername = function(collection,username,callback) {
  var err = null;
  
  mongoDB.collection(collection).find({'username':username}).toArray(function(err, docs){
     if (err) doError(err);
      callback(err, docs[0]);
  });
}

exports.findById = function(collection,id, callback) {
  var err = null;
  var ObjectId = require('mongodb').ObjectID;

   mongoDB.collection(collection).findOne({'_id': new ObjectId(id)}, function(err, doc){
    if (err) doError(err);
    callback(err, doc);
  });
}
  
/********** CRUD Create -> Mongo insert ***************************************
 * @param {string} collection - The collection within the database
 * @param {object} data - The object to insert as a MongoDB document
 * @param {function} callback - Function to call upon insert completion
 *
 * See the API for more information on insert:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertOne
 */

exports.create = function(collection, data, callback) {
  // Do an asynchronous insert into the given collection
  mongoDB.collection(collection).insertOne(
  data,                     // the object to be inserted
  function(err, status) {   // callback upon completion
    if (err) doError(err);
    // use the callback function supplied by the controller to pass
    // back true if successful else false
    var success = (status.result.n == 1 ? true : false);
    callback(success);
  });
}

/********** CRUD Retrieve -> Mongo find ***************************************
 * @param {string} collection - The collection within the database
 * @param {object} query - The query object to search with
 * @param {function} callback - Function to call upon completion
 *
 * See the API for more information on find:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find
 * and toArray:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#toArray
 */
exports.retrieve = function(collection, query, callback) {
  /*
   * The find sets up the cursor which you can iterate over and each
   * iteration does the actual retrieve. toArray asynchronously retrieves the
   * whole result set and returns an array.
   */
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
      if (err) doError(err);
      
      // docs are MongoDB documents, returned as an array of JavaScript objects
      // Use the callback provided by the controller to send back the docs.
      callback(docs);
  });
  
};

/********** CRUD Update -> Mongo updateMany ***********************************
 * @param {string} collection - The collection within the database
 * @param {object} filter - The MongoDB filter
 * @param {object} update - The update operation to perform
 * @param {function} callback - Function to call upon completion
 *
 * See the API for more information on insert:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#updateMany
 */
exports.update = function(collection, filter, update, callback) {
  mongoDB
    .collection(collection)     // The collection to update
    .updateOne(                // Use updateOne to only update 1 document
      filter,                   // Filter selects which documents to update
      update,                   // The update operation
      {upsert:true},            // If document not found, insert one with this update
                                // Set upsert false (default) to not do insert
      function(err, status) {   // Callback upon error or success
        if (err) doError(err);
        callback('Modified '+ status.modifiedCount 
                 +' and added '+ status.upsertedCount+" documents");
        });
}

/********** CRUD Delete -> Mongo deleteOne or deleteMany **********************
 * The delete model is left as an exercise for you to define.
  * @param {string} collection - The collection within the database
 * @param {object} data - The object to delete as a MongoDB document
 * @param {function} callback - Function to call upon delete completion
 *
 * See the API for more information on deleteOne:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#deleteOne
 */

exports.delete = function(collection, data, callback) {
  mongoDB.collection(collection).deleteOne(
    data,                     // the object to be deleted
    function(err, status) {   // callback upon completion
      if (err) doError(err);
      // use the callback function supplied by the controller to pass
      // back true if successful else false
      var success = (status.result.ok == 1 ? true : false);
      callback(success);
    });
}

var doError = function(e) {
  console.error("ERROR: " + e);
  throw new Error(e);
}








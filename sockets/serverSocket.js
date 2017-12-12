exports.init = function(io) {
    var currentPlayers = 0; // keep track of the number of players
    var msg;
    var seconds=0;
  // When a new connection is initiated
    io.sockets.on('connection', function (socket) {
        
    });

    //changing namespace between user pair
    var user_nsp = io.of('/test');
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

exports.initSockets = function(io) {
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
        //for textarea
        socket.on('live_write', function(data){
            writing = data.text;
            socket.broadcast.emit('live_write',{text: writing});
            socket.emit('live_write', {text: writing});
        });
        //for title
        socket.on('live_write_title', function(data){
            writing = data.title;
            socket.broadcast.emit('live_write_title',{title: writing});
            socket.emit('live_write_title', {title: writing});
        });
        socket.on('clear_text', function(data){
            socket.broadcast.emit('clear_text', {text: data.text});
            socket.emit('clear_text', {text: data.text});
        })
        //disconnect     
        socket.on('disconnect', function () {
            --currentPlayers;
            socket.emit('players', { number: currentPlayers});
            socket.broadcast.emit('players', { number: currentPlayers});
            socket.broadcast.emit('welcome', {welcome_msg: "Welcome player, "+currentPlayers});
        });
        
    });
}
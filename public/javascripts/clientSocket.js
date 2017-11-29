
var socket = io.connect('/');
socket.on('players', function (data) {
    $("#numPlayers").text(data.number);
    });
socket.on('welcome', function(data){
    $("#welcome").text(data.welcome_msg);
});



socket.on('live_write', function(data){
    console.log("inside append");
    $("#test").append().text(data.text);
    $("#card").val(data.text);
});


//////////////////////BROWSER EVENTS/////////////////////////
$(function () {
  $("#card").keyup(function(e){
    if (e.which==13){
        var writing = $('#card').val();
        //console.log("writing variable is: "+writing);
        socket.emit('live_write', {text: writing});
    }
  }); 
  $("#chat").click(function(){
    document.getElementById("overlay").style.display = "block";
  });
  $("#sendchat").click(function(){
    document.getElementById("overlay").style.display = "none";
  });

});



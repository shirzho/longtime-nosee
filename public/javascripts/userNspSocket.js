var nspID = require('../routes/dbRoutes.js');
console.log("NSPNSPNSPNSP "+nspID.NSP);
function checkNSP(nspVar){
  if(nspVar){
    return nspVar;
  }else{
    return "test";
  }
}
var userNsp_socket = io.connect('/'+checkNSP(nspID.NSP));

userNsp_socket.on('players', function (data) {
    $("#numPlayers").text(data.number);
    });
userNsp_socket.on('welcome', function(data){
    $("#welcome").text(data.welcome_msg);
});

userNsp_socket.on('live_write', function(data){
    console.log("receiving data.text as "+data.text);
    $("#card").val(data.text);
});

userNsp_socket.on('sending_chat', function(txt){
    document.getElementById("overlay_screen").style.display = "block";
    $("#message").append(txt+ "<br>");
});


//////////////////////BROWSER EVENTS/////////////////////////
$(function () {
  $("#card").keyup(function(e){
    if (e.which==32){ //key for spacebar
        var writing = $('#card').val();
        console.log("writing variable is: "+writing);
        userNsp_socket.emit('live_write', {text: writing});
    }
  }); 
  $("#chat").click(function(){
    document.getElementById("overlay_screen").style.display = "block";
  });
  $("#sendchat").click(function(){
    userNsp_socket.emit('sending_chat', $('#chatbox').val());
    document.getElementById("overlay_screen").style.display = "none";
    $("#chatbox").val("");
  });
  $("#quit").click(function(){
    document.getElementById("overlay_screen").style.display = "none";
    $("message").text("")
  })

});



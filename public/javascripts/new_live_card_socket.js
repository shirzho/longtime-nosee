
var userNsp_socket = io.connect('/test');

userNsp_socket.on('players', function (data) {
    $("#numPlayers").text(data.number);
    });
userNsp_socket.on('welcome', function(data){
    $("#welcome").text(data.welcome_msg);
});

userNsp_socket.on('live_write', function(data){
    $("#card").val(data.text);
});

userNsp_socket.on('live_write_title', function(data){
    $("#cardName").val(data.title);
});

userNsp_socket.on('clear_text', function(data){
    $("#cardName").val(data.text);
    $('#card').val(data.text);
});

userNsp_socket.on('sending_chat', function(txt){
    document.getElementById("overlay_screen").style.display = "block";
    $("#message").append(txt+ "<br>");
});


//////////////////////BROWSER EVENTS/////////////////////////
$(function () {
  $("#infoForSave").children().hide();

  $("#cardName").keyup(function(){
        var writing = $('#cardName').val();
        userNsp_socket.emit('live_write_title', {title: writing});
    
  });
  $("#card").keyup(function(e){
    if (e.which==32){ //key for spacebar
        var writing = $('#card').val();
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
  $("#save").click(function(){
    $("#infoForSave").children().show();
  });
  $("#getBuddyName").click(saveNewCard);

});

//save an old card (UPDATE) you created w another user
function saveUpdateCard(event){
  var card = $('#card').val();
  var cardName = $('#cardName').val();
  var buddyName = $('#buddyName').val();
  $.ajax({
          url: './livecards',
          type: 'POST',
          data: {filter: buddyName , update:{cardName, card}},
          success: function(result){
                    console.log("updated user");  
                },
          error: function(response, status) {
                    console.log('didnt find user');
                }
        });
        event.preventDefault();
}

//save a new card (CREATE) you created w another user
function saveNewCard(event){
  var card = $('#card').val();
  var cardName = $('#cardName').val();
  var buddyName = $('#buddyName').val();

  $.ajax({
          url: './livecards',
          type: 'PUT',
          data: {"cardName":cardName, "cardContent": card, "pair" : buddyName},
          success: function(result){
                    console.log("created new card"); 
                    $("#successmsg").text("You have saved the card to the database!"); 
                    
                },
          error: function(response, status) {
                    $("#successmsg").text("saving card failed."); 
                    console.log('could not create card');
                }
        });
        event.preventDefault();
        $("#card" ).val("");
        $("#cardName" ).val("");
        var blank = "";
        userNsp_socket.emit('clear_text', {text: blank});
}



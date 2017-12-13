
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

userNsp_socket.on('sending_chat', function(txt){
    document.getElementById("overlay_screen").style.display = "block";
    $("#message").append(txt+ "<br>");
});


//////////////////////BROWSER EVENTS/////////////////////////
$(function () {
  $("#infoForSave").children().hide();


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
  $("#getBuddyName").click(saveUpdateCard);

  $('#getByUser').submit(getCardsByUser);

  $('#getByCardName').submit(getCardsByCardName);
});


//save an old card (UPDATE) you created w another user
function saveUpdateCard(event){
  var card = $('#card').val();
  var cardName = $('#findByCardName').val();
  var buddyName = $('#buddyName').val();
  $.ajax({
          url: './livecards',
          type: 'POST',
          data: {filter: cardName , update:card},
          success: function(result){
                console.log("successfully retrieved card");
                $("#edit_card").append(result) 
                },
          error: function(response, status) {
                    console.log('didnt find user');
                }
        });
        event.preventDefault();
}

function getCardsByUser(event){
        var getUser = $('#findByUser').val();
        $.ajax({
            url: './livecards', //collection name
            type: 'GET',
            data: { "pair": getUser },
            success: function(result){
                console.log("successfully retrieved cards");
                $("#card_msg").append(result)
            }
        });
        event.preventDefault();
    }

function getCardsByCardName(event){
        var getCard = $('#findByCardName').val();
        $.ajax({
            url: './livecards', //collection name
            type: 'GET',
            data: { "cardName": getCard },
            success: function(result){
                console.log("successfully retrieved cards");
                $("#edit_card_bytitle").html(result)
            }
        });
        event.preventDefault();
    }



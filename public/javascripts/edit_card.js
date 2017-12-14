



//////////////////////BROWSER EVENTS/////////////////////////
$(function () {
 

  $("#save").click(saveUpdateCard);


  $('#getByUser').submit(getCardsByUser);

  $('#getByCardName').submit(getCardsByCardName);
});


//save an old card (UPDATE) you created w another user
function saveUpdateCard(event){
  var card = $('#card').val();
  console.log("THIS IS CARD VAL FOR EDIT CARD "+ card);
  var cardName = $('#findByCardName').val();
  //var buddyName = $('#buddyName').val();
  $.ajax({
          url: './livecards',
          type: 'POST',
          data: {filter: cardName , update:card},
          success: function(result){
                console.log("successfully updated/edited card");
                $("#edit_card").html(result) 
                },
          error: function(response, status) {
                    console.log('didnt find user');
                }
        });
        event.preventDefault();
        $("#card" ).val("");
}

function getCardsByUser(event){
        var getUser = $('#findByUser').val();
        $.ajax({
            url: './livecards', //collection name
            type: 'GET',
            data: { "pair": getUser },
            success: function(result){
                console.log("successfully retrieved cards");
                $("#card_msg").html(result);
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



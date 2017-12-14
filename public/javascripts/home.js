
$(document).ready(function(){

    $('#edit_user').submit(update_user);
    $('#delete_card').submit(deleteCard);
    $('#getByUser').submit(getCardsByUser);


    
});//close document ready

    function update_user(event){
            var updated_user = $('#orig_username').val();
            var updated_firstname = $('#edit_firstName').val();
            //var last_name = $('#lastName').val();
            //console.log(updated_user, updated_firstname);
            $.ajax({
                url: './users',
                type: 'POST',
                data: {filter: updated_user, update: updated_firstname},
                success: function(result){
                    console.log("updated user");
                    $('#edit_msg').text('updated!')  
                },
                error: function(response, status) {
                    console.log('didnt find user');
                }
            });
            event.preventDefault();
            $('#orig_username').val("");
            $('#edit_firstName').val("");
    }

    function deleteCard(event){
        var cardName = $('#deleted_cardName').val();
        console.log("the item being deleted is: " + cardName);
        $.ajax({
            url: './livecards',
            type: 'DELETE',
            data: { "cardName": cardName },
            success:function(result){
                console.log("Successfully deleted card");
                $('#delete_result').append(result);
            }
        });
        event.preventDefault();
    }//delete card

    //retrieve all cards with this user
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

    // function add_livecard_user(event){
    //     var user_added = $('#user_added').val();

    //     $.ajax({
    //         url: './livecards', //collection name
    //         type: 'PUT',
    //         data: {username: user_added },
    //         success: function(result){
    //         }
           
    //     });
    //     event.preventDefault();
    // }



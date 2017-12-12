
$(document).ready(function(){

    $('#edit_user').submit(update_user);
    $('#delete_user').submit(delete_user);
    $('#addUser').submit(add_livecard_user);

    
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
                },
                error: function(response, status) {
                    console.log('didnt find user');
                }
            });
            event.preventDefault();
    }

    function delete_user(event){
        var name = $('#deleted_username').val();
        console.log("the item being deleted is: " + name);
        $.ajax({
            url: './users',
            type: 'DELETE',
            data: { username: name },
            success:function(result){
                console.log("Successfully deleted item");
                $('#delete_result').append(result);
            }
        });
        event.preventDefault();
        $('#delete_username').val('');
    }//delete user  

    function add_livecard_user(event){
        var user_added = $('#user_added').val();

        $.ajax({
            url: './livecards', //collection name
            type: 'PUT',
            data: {username: user_added },
            success: function(result){
            }
            //figure out how to check if user_added exists in Users collection first
            //THEN add username as an array value in a new document for livecards collection
        });
        event.preventDefault();
        
    }



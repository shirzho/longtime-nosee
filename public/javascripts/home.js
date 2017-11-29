
$(document).ready(function(){

    $('#edit_user').submit(update_user);
    $('#delete_user').submit(delete_user);


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
        //$('#delete_result').empty();
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
    }
    //delete user

});//close document ready
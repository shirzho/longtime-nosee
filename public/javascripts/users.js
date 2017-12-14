//js that interacts between the user view and mongoroutes backend

$(document).ready(function(){
    
    $('#register').submit(create_user);
   
  
   

}); //this closes document.ready()


function create_user(event){
        //set all user input pulled from view to vars here
        let first_name = $('#firstName').val();
        let last_name = $('#lastName').val();
        let user_name = $('#userName').val();
        let password = $('#passwd').val();
        $.ajax({
            url: './users', //this is the collection name in the mongodb
            type: 'PUT',
            data: {firstname: first_name, lastname: last_name, username: user_name, pwd: password},
            success: function(result){
                console.log("created new user!")
                $('#reg_msg').text(" You successfully created your account!");
                //clear form
                //$('#register').empty();
            },
            error: function(response, status){
                console.log('unable to create new user')
            }
        });
        event.preventDefault();
    }

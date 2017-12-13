//js that interacts between the user view and mongoroutes backend

$(document).ready(function(){
    
    $('#register').submit(create_user);
    $('#login').submit(login_user);

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
    //create GET action which will check if user input matches what is stored in database and log the user in
    function login_user(event){
        let user_name = $('#login_userName').val();
        let password = $('#login_passwd').val();
        console.log(user_name, password);
        $.ajax({
            url: './users',
            type: 'GET',
            data: {username: user_name, pwd: password},
            success: function(result){
                console.log("found user!");
                //console.log(result);
                // if (result.length==0){
                //     $('#login_msg').html('NOPE your user doesnt exist or you have wrong credentials')
                // }
                //$('#login_msg').html(result);
                window.location.href='/home';
                
            },
            error: function(response, status) {
                console.log('didnt find user');
                $('#login_msg').html("Username or password incorrect, please try again.");
            }
        });
        event.preventDefault();
    }
  
   

}); //this closes document.ready()




$(document).ready(function(){
    $('#auth').submit(authenticate_user);

    function authenticate_user(event){
        let user_name = $('#username').val();
        let password = $('#password').val();
        $.ajax({
            type: 'POST',
            action: '/login'
            success: function(result){
                console.log("logged in")
            },
            error: function(response, status){
                console.log('you done goofed')
            }
        });
        event.preventDefault();
    }
}
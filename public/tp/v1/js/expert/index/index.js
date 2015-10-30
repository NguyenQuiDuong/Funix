/**
 * Created by Ace on 30-Oct-15.
 */
$('#signupemail').click(function(){
    $.post(
        '/user/user/signupemail',
        {
            email: $('#user_email').val(),
        },
        function(rs){
            if(rs.code ==  1){
                $('#errorModal').empty();
                $('#errorModal').append('<div> class="center alert alert-error flash-message topAlert"><div id="flash_alert">'+rs.data+'</div></div>');
            }
            if(rs.code == 2){
                $('#errorModal').empty();
                $('#errorModal').append('<div class="center alert alert-success flash-message topAlert"><div id="flash_alert">'+rs.data+'</div></div>');
            }
        }
    )
})
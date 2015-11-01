/**
 * Created by DatNM on 10/21/2015.
 */


$(document).ready(function(){

    $('.chat_head').click(function(){
        $('.chat_body').slideToggle('slow');
    });
    $('.user').click(function(){

        $('.msg_wrap').show();
        $('.msg_box').show();
    });

    $('textarea').keypress(
        function(e){
            if (e.keyCode == 13) {
                var msg = $(this).val();
                $(this).val('');
                if(msg!='')
                    $('<div class="msg_b">'+msg+'</div>').insertBefore('.msg_push');
                $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
            }
        });



});
function showChat(id){
        //$('#'+'id'+'.msg_wrap').slideToggle('slow');
        $('.msg_wrap').slideToggle('slow');

}
function closeChat(id){
            $('#'+id).remove();
    console.log($('.msg_box'))
    console.log( $('#'+id));
}

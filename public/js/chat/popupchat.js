/**
 * Created by DatNM on 10/21/2015.
 */

$('.user').each(function(){
    $(this).click(function () {
        $('body').append(
            '<div class="msg_box" style="right:290px">'+
                '<div class="msg_head">'+$(this).text()+
                '<div class="close">x</div>'+
            '</div>'+
            '<div class="msg_wrap">'+
                '<div class="msg_body">'+
                    '<div class="msg_a">This is from A</div>'+
                    '<div class="msg_b">This is from B, and its amazingly kool nah... i know it even i liked it :)</div>'+
                    '<div class="msg_a">Wow, Thats great to hear from you man</div>'+
                    '<div class="msg_push"></div>'+
            '</div>'+
                '<div class="msg_footer">'+
                    '<input type="text" class="msg_input" rows="1">'+
                '</div>'+
            '</div>'+
            '</div>')
    });
});



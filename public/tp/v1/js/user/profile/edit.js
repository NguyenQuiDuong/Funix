/**
 * Created by Ace on 10-Nov-15.
 */
//-------------------------Upload file drop zone --------------------------
Address.load();
$('#update-wrapper').dropzone({
    'url': '/user/profile/avatar',
    'createImageThumbnails' : false,
    'previewsContainer' : '#preview-template',
    'success' : function(file, code){
        if(code.code){
            console.log(123);
            $('#error_img').removeClass('hidden');
            $('#error_img').text(code.messages);
        }else{
            console.log(code.path);
            if(!$('#error_img').hasClass('hidden')){
                $('#error_img').addClass('hidden');
            }
            $('#div-profile-photo').empty();
            $('#div-profile-photo').html('<img id="profile-photo" class="img-polaroid profile-photo-big" src="'+code.path+'">');
        }
    },
});
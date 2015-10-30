/**
 * Created by Ace on 30-Oct-15.
 */

$('content').each(function(){
    $(this).ckeditor({
        language: usrCnf.lang,
        uiColor: '#f9f9f9',
        height: $(this).css('height') ? $(this).css('height') : '400px',
        extraPlugins: 'autolink',
//				filebrowserImageBrowseUrl : '/media/manage/uploadframe?'+getParamForFileBrowser(),
    });
});
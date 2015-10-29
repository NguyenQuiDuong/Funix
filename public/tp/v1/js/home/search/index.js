/**
 * Created by Ace on 25-Oct-15.
 */
//store the element
var $cache = $('.skrollable');

//store the initial position of the element
var vTop = $cache.offset().top - parseFloat($cache.css('margin-top').replace(/auto/, 0));
$(window).scroll(function (event) {
    // what the y position of the scroll is
    var y = $(this).scrollTop();

    // whether that's below the form
    if (y >= vTop) {
        // if so, ad the fixed class
        $cache.css({'position':'fixed','top':'20px','left':'auto','width':'870px'});
    } else {
        $cache.css({'position':'absolute','top':'0px','left':'0px','width':'100%'});
    }
});
$('.btn-post-request').click(function () {
    $('.request-form').removeClass('ng-hide');
    $('.request-info-wrapper').addClass('ng-hide');
    $('html').append('<div class="non-login-form-bg"></div>');
});
$('.cancel').click(function(){
    $('.request-info-wrapper').removeClass('ng-hide');
    $('.request-form').addClass('ng-hide');
    $('.non-login-form-bg').remove();
})
// radio button
jQuery(function ($) {
    $('div.budget-buttons[data-toggle-name]').each(function () {
        var group = $(this);
        var form = group.parents('form').eq(0);
        var name = group.attr('data-toggle-name');
        var hidden = $('input[name="' + name + '"]', form);
        $('button', group).each(function () {
            var button = $(this);
            button.on('click', function () {
                hidden.val($(this).val());
                $('div.budget-buttons button').each(function(){
                    if($(this).val() == hidden.val()){
                        $(this).addClass('active');
                    }else{
                        $(this).removeClass('active');
                    }
                })
            });
            if (button.val() == hidden.val()) {
                button.addClass('active');
            }
        });
    });
});
if($('.password-input').hasClass('ng-hide')){
    $('#password').val('');
}
function  showPassword(){
    if($('.password-input').hasClass('ng-hide')){
        $('.password-input').removeClass('ng-hide');
    }else{
        $('.password-input').addClass('ng-hide');
        $('#password').val('');
    }
}
//tags

var subjects = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
        url: window.location.origin+"/subject/subject/fetchall",
        cache: false
    },
});
subjects.initialize();
var elt = $('.controls input');
elt.tagsinput({
    itemValue: 'id',
    itemText: 'name',
    typeaheadjs: {
        name: 'subjects',
        displayKey: 'name',
        source: subjects.ttAdapter()
    },
    onTagExists: function(item, $tag) {
        $tag.hide.fadeIn();
    },
    trimValue: true
});

$('#submit').click(function(){
    $.post(
        '/home/search/findmentor',
        {
            search:$('input[name="search"]').val(),
            searchDetail:$('input[name="searchDetail"]').val(),
            subjectId:$('input[name=subject]').val(),
            email: $('input[name=email]').val(),
            password:$('input[name=password]').val(),
        },
        function(rs){
            if(rs.code == 1){
                $('.errorMsg').text(rs.data[0]);
            }else {
                if (rs.code == 2) {
                    $('.request-info-wrapper').removeClass('ng-hide');
                    $('.request-form').addClass('ng-hide');
                    $('.non-login-form-bg').remove();
                    $('.request-info-wrapper').append('<div class="center alert flash-message topAlert alert-success" id="broadcastSuccess"><a class="close" data-dismiss="alert">×</a><div class="msg">'+rs.data+'</div></div>');
                    $('.request-info').remove();
                } else {
                    $.redirect(
                        '/home/search/findmentor',
                        {
                            search: $('input[name="search"]').val(),
                            searchDetail: $('input[name="searchDetail"]').val(),
                            subjectId: $('input[name=subject]').val(),
                            email: $('input[name=email]').val(),
                            password: $('input[name=password]').val(),
                        }
                    )
                }
                $('#submit').prop('disabled', true);
            }
        }
    )
});
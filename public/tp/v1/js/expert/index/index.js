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
                $('#errorModal').append('<div class="center alert alert-error flash-message topAlert"><div id="flash_alert">'+rs.data+'</div></div>');
            }
            if(rs.code == 2){
                $('#errorModal').empty();
                $('#errorModal').append('<div class="center alert alert-success flash-message topAlert"><div id="flash_alert">'+rs.data+'</div></div>');
            }
        }
    )
});

$('#subject').autocomplete({
    source: function(request, response){
        $.post(
            '/subject/subject/suggestcategory',
            {
                'q' : request.term
            },
            function(rs){
                if(rs.code){
                    response(rs.data);
                } else {
                    response([]);
                }
            }
        );
    },
    minLength: 2,
    select: function(event, ui){
        event.preventDefault();
        $('#subject').val('');
        addAttendanceTag(ui.item);

    },
});

$('.bootstrap-tagsinput').on('click', '.removeTag', function(){
    $(this).parent().remove();
    refillAttendanceId()
});

function addAttendanceTag(item){
    text = '<span class="tag label label-info">' +
        '<span class="ng-binding ng-scope subjectIdtag" value="'+item.id+'">'+item.name
        +
        '<a data-role="remove" class="removeTag remove-button ng-binding ng-scope">x</a></span>';
    $('#subject').parent().prepend(text);
    refillAttendanceId()
}
function refillAttendanceId(){
    var attendanceIds = [];
    $('#subject').parent().find('.subjectIdtag').each(function(){
        attendanceIds.push($(this).attr('value'));
    });
    $('#subjectId').val(attendanceIds.join(','))
}
$('.searchButton').click(function () {
    var uri = '/experts/index/list?id='+$('#subjectId').val();
    console.log(uri);
    location.replace(uri);
});
$('.searchBarContent').click(function(){
    $('.searchBarContent input').focus();
});

function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

$('.searchBarContent input[type="text"]')
// event handler
    .keyup(resizeInput)
    // resize on page load
    .each(resizeInput);
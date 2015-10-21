/**
 * Created by Ace on 20-Oct-15.
 */
$(document).ready(function(){
    autoPlayYouTubeModal();
});

//FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
function autoPlayYouTubeModal() {
    var trigger = $("body").find('[data-toggle="modal"]');
    trigger.click(function () {
        var theModal = $(this).data("target"),
            videoSRC = $(this).attr("data-theVideo"),
            videoSRCauto = videoSRC + "?autoplay=1&rel=0&amp;showinfo=0";
        $(theModal + ' iframe').attr('src', videoSRCauto);
        $(theModal + ' button.close').click(function () {
            $(theModal + ' iframe').attr('src', videoSRC);
        });
    });
};

$("#myModal").on('hidden.bs.modal', function (e) {
    $("#myModal iframe").attr("src","");
});
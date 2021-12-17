$(function () {
    var len = $('td').length;
    for (var i = 0; i < len; i++) {
        var cell = $('td').get(i);


        if (i % 4 == 0) {
            $(cell).html(i / 4 + 1 + '<input type="button" value="詳細">');
        } else {
            if(inkanName=='okabe'){
                $(cell).text(his[Math.floor(i / 4)][i % 4 - 1]);
            } else {
                $(cell).html('<input class="his_input" type="text">');
            }
        }

    }

    $('.inkan-wrap').hide();


    var i = 0;

    function changeInkan() {
        if (i < 6) {
            console.log('img/' + inkanName + (i % 3 + 1) + '.jpg');
            $('.inkan').attr('src', 'img/' + inkanName + (i % 3 + 1) + '.jpg');
            i++;
        }

    }

    var isShown = false;
    var timer;

    $(window).on('keypress', function () {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (isShown) {
                $('.inkan-wrap').hide();
                clearInterval(timer);
            } else {
                $('.inkan-wrap').show();
                i = 0;
                timer = setInterval(changeInkan, 1000);
            }
            isShown = !isShown;
        }
    });
});

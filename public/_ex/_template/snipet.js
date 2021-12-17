$(function () {

    var flag = false;

    $(".main").on("load", function(){
        if(flag){
            $("input").hide();
        } else {
            $("input").show();
        }
    });

    $("#goto2").on("click", function () {
        $(".main").attr("src", flag ? "img/t01.png" : "img/t02.png");
        flag = !flag;
    });

});

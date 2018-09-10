$(function(){
    $(".nav ul li").mouseover(function(){
        $(this).find("a").addClass("active");
        $(this).siblings().find("a").removeClass("active");
    })
    $(".nav ul li").mouseleave(function(){
        $(this).find("a").removeClass("active");
    })
    $(".secNav span").click(function(){
        var baseUrl = "/productService/";
        console.log($(this).attr("name"));
        var href = $(this).attr("name");
        window.sessionStorage.setItem("pageIndex",href);
        // window.location.pathname = baseUrl + "productService/productService.html"
        // window.location.href = window.location.origin
        window.location.href = "../productService/productService.html";
    })
})
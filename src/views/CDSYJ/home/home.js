$(function(){
    $(".product_item").mouseover(function(){
        $(this).find(".hide_con").css({
            bottom: 0
        });
        $(this).siblings().find(".hide_con").css({
            bottom: "-130px"
        });
        $(this).find(".show_con").css({
            display: "none"
        });
        $(this).siblings().find(".show_con").css({
            display: "block"
        });
        $(this).find(".hideIcon").css({
            top: "20px",
            width: "80px"
        });
        $(this).siblings().find(".hideIcon").css({
            top: "-110px",
            width: "110px"
        });
    })
    $(".product_item").mouseleave(function(){
        $(this).find(".hide_con").css({
            bottom: "-130px"
        });
        $(this).find(".show_con").css({
            display: "block"
        });
        $(this).find(".hideIcon").css({
            top: "-110px",
            width: "110px"
        });
    })
    $(".partnerImg ul li").mouseover(function(){       
        $(this).find(".hide_logo").show().addClass('animated flipInX');
        $(this).find(".show_logo").hide();
    })
    $(".partnerImg ul li").mouseleave(function(){       
        $(this).find(".show_logo").show().addClass('animated pulse');
        $(this).find(".hide_logo").hide();
    })
    $(".moreClick").click(function(){
        sessionStorage.setItem("pageIndex",$(this).attr("name"));
        // window.location.pathname = baseUrl + "productService/productService.html"
        window.location.href = "../productService/productService.html";
    })

    $(".centerTxt").show().addClass('animated bounceInDown');
    window.addEventListener("scroll",function(){
        let flag = $(".contactBox").css("display") === "block";
        if (!flag) {
            startAnimate();
        }
    })
    window.onresize = function() {
        let flag = $(".contactBox").css("display") === "block";
        if (!flag) {
            startAnimate();
        }
    }
    setVideo();
})
function setVideo(){
    let clientH = window.innerHeight || document.documentElement.clientHeight;
    let vH = $("#video").height();
    let vTop = 0;
    console.log(vH);
    console.log(clientH);
    if (vH > clientH) {
    	vTop = -((vH - clientH) / 2);
    }
//  $("#video").css({
//      "margin-top": vTop + "px"
//  })
}
function startAnimate(){
    let clientH = window.innerHeight || document.documentElement.clientHeight;
    let scrollY = 0;
    scrollY = $(document).scrollTop() || document.documentElement.scrollTop;
    let industryH = getPos("industryCon").y;
    let desinH = getPos("designCon").y;
    let productH = getPos("productCon").y;
    let productItemH = getPos("productItemCon").y;
    let caseH = getPos("caseCon").y;
    let caseAreaH = getPos("areaCon").y;
    let partnerH = getPos("partnerCon").y;
    let partnerLogoH = getPos("partnerImg").y;
    let contactH = getPos("contactCon").y;
    if (scrollY >= (industryH - clientH + 45)) {
        $(".com_left").show().addClass('animated bounceInLeft');
        $(".com_right").show().addClass('animated bounceInRight');
    }
    if (scrollY >= (desinH - clientH + 80)) {
        $(".bg_l").show().addClass('animated bounceInLeft');
        $(".bg_r").show().addClass('animated bounceInRight');
        $(".designTitle").show().addClass('animated fadeInDown');
        $(".computer").show().addClass('animated fadeIn');
    }
    if (scrollY >= (productH - clientH + 100)) {
        $(".productTitle").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (productItemH - clientH + 150)){
        $(".product_item").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (caseH - clientH + 100)){
        $(".caseTitle").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (caseH - clientH + 200)){
        $(".case_titles").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (caseAreaH - clientH + 100)){
        $(".case_area").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (partnerH - clientH + 100)){
        $(".partnerTitle").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (partnerLogoH - clientH + 100)){
        $(".partnerImg ul li").show().addClass('animated fadeInDown');
    }
    if (scrollY >= (contactH - clientH + 100)){
        $(".contactBox").show().addClass('animated bounceIn');
    }
}
function getPos(ClassName){	
    let ele = document.getElementsByClassName(ClassName);
    let top = ele[0].offsetTop;
    let left = ele.offsetLeft;
    let offsetEle = ele.offsetParent;
    while (offsetEle) {
        top += offsetEle.offsetTop;
        left += offsetEle.offsetLeft;
        offsetEle = offsetEle.offsetParent;
    }	
    let o={};
    o.x=left;
    o.y=top;
    return o;
}

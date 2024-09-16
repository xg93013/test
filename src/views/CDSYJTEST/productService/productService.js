$(function() {
	var pageIndex = sessionStorage.getItem("pageIndex")-1;
	// if(pageIndex == 1) {
	// 	$("#assMap,#riskMap").remove();
	// } else if(pageIndex == 2) {
	// 	$("#riskMap,#riskAnalysis").remove();
	// } else {
	// 	$("#assMap,#riskAnalysis").remove();
	// }
	$(".secondPage").eq(pageIndex).show().siblings(".secondPage").hide();
	// var mySwiper = new Swiper('.swiper-container', {
	// 	autoplay: {
	// 		delay: 4000,
	// 		disableOnInteraction: false
	// 	},
	// 	loop: true,
	// 	pagination: {
	// 		el: '.swiper-pagination',
	// 		clickable :true
	// 	}
	// });
	// $('.swiper-container').mouseenter(function() {
	// 	mySwiper.autoplay.stop();
	// }).mouseleave(function() {
	// 	mySwiper.autoplay.start();
	// });
})
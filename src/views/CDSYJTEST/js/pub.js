(function(win) {
	var doc = win.document;
	var docEl = doc.documentElement;
	var tid;

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		var rem;
		if((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i))) {
			if(width > 640) { // 最大宽度
				width = 640;
			}
			rem = width * 12 / 320;
		} else {
// 			if(width>1200){
// 				rem = 10;
// 			}else{
// //				if(width > 500) { // 最大宽度
// //					width = 500;
// //				}
// 				rem = width * 12 / 640;
// 			}
			rem = 10
		}
		docEl.style.fontSize = rem + 'px';
	}
	refreshRem();
	$(window).resize(function(){
		refreshRem();
	});
})(window);

$(function(){
	$("body").css("display","block");
})



//http://www.unionbigdata.com/about.aspx?t=10
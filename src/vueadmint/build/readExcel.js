const path = require('path')
const XLSX = require('xlsx')
const fs = require('fs')

exports.startReadExcel = function () {
  	const workbook = XLSX.readFile(path.resolve(__dirname, '../src/assets/excel/test.xlsx'));

	// 获取 Excel 中所有表名
	const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
	var tempData = {};
	var sheetOne = [];
	for (var i=0;i<sheetNames.length;i++) {
		var worksheet = workbook.Sheets[sheetNames[i]];
	  	for (z in worksheet) {
	    	/* 带!的属性（比如!ref）是表格的特殊属性，用来输出表格的信息，不是表格的内容，所以去掉 */
	    	if(z[0] === '!') continue;
	    	workbook.Sheets[sheetNames[i]][z].w = worksheet[z].w.replace('\n','').replace(/(^\s+)|(\s+$)/g, '');
	  	}
	  	if (i === 0) {
	  		sheetOne = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);
	  	}
	    tempData[sheetNames[i]] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);
	}
	fs.open(path.resolve(__dirname, '../src/assets/data/test.js'), 'w', function (err, fd) {
	    const buf = 'export default ' + JSON.stringify(sheetOne);
	    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
	});
}
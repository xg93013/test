<template>
  <div id="amap-box">
    <!--<input type="file" @change="fileChange" />-->
    <el-button @click="excelToJson">excel转换json</el-button>
    <el-button @click="getAsyncData">getAsyncData</el-button>
    <el-button @click="jsonToSheet">导出</el-button>
    <input type="file" id="fileInput" @change="changeFile" ref="fileInput" style="display: none;">
    <div>
      <!--{{ excelJson }}-->
    </div>

    <div class="table-box" id="out-table">
      <!--<table id="sheetjs">
			<tr><td>S</td><td>h</td><td>e</td><td>e</td><td>t</td><td>J</td><td>S</td></tr>
			<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>
			<tr><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>
      </table>-->
      <template>
        <el-table :data="allData" style="width: 100%">
          <el-table-column fixed prop="id" label="序号" width="100"></el-table-column>
          <el-table-column prop="name" label="经营者名称" width="220"></el-table-column>
          <el-table-column prop="address" label="经营场所"></el-table-column>
          <el-table-column prop="area" label="所属区域"></el-table-column>
          <el-table-column prop="score" label="评分"></el-table-column>
          <el-table-column prop="rank" label="安全等级"></el-table-column>
          <el-table-column prop="person" label="评定人员"></el-table-column>
          <el-table-column prop="time" label="评定时间"></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
import md5 from "js-md5";
import jsonData from "@/assets/data/test.js";
import { myDOM } from "@/assets/js/myUtils.js";

//	const wb = // 读取完成的数据
const rABS = false; // 是否将文件读取为二进制字符串
export default {
  data() {
    return {
      tableId: "out-table",
      allData: [],
      excelJson: "",
      tableData3: [
        {
          a: 2,
          b: 3,
          c: 4
        }
      ]
    };
  },
  created() {
    this.getAllData();
  },
  methods: {
    // 转换key
    switchKey(key) {
      let name = "";
      switch (key) {
        case "序号":
          name = "id";
          break;
        case "经营者名称":
          name = "name";
          break;
        case "经营场所":
          name = "address";
          break;
        case "所属区域":
          name = "area";
          break;
        case "评分":
          name = "score";
          break;
        case "安全等级":
          name = "rank";
          break;
        case "评定人员":
          name = "person";
          break;
        case "评定机关":
          name = "organ";
          break;
        case "评定时间":
          name = "time";
          break;
        case "监管建议":
          name = "suggest";
          break;
        case "整改原因":
          name = "reason";
          break;
        case "处罚动态":
          name = "punishNews";
          break;
        default:
          break;
      }
      return name;
    },
    // 所有数据格式化
    getAllData() {
      let _self = this;
      let outArr = [];
      if (jsonData.length > 0) {
        let originData = jsonData.splice(0);
        for (let i = 0; i < originData.length; i++) {
          let oneData = {};
          // oneData.id = (i + 1)
          for (let key in originData[i]) {
            oneData[_self.switchKey(key)] = originData[i][key];
          }
          outArr.push(oneData);
        }
        this.allData = outArr;
      }
    },
    fileChange(e) {
      let files = e.target.files[0];
      let reader = new FileReader();
      reader.readAsBinaryString(files);
      reader.onload = function(e) {
        //					console.log(e.target.result)
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        //					console.log(wb.SheetNames)
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        /* Update state */
      };
    },
    mdFun() {
      var md5Str = md5("username");
    },
    // xlsx 导出
    exportExcel() {
      /* generate workbook object from table */
      console.log(document.getElementsByTagName("table")[1]);
      var tableHeader = XLSX.utils.table_to_book(
        document.getElementsByTagName("table")[0]
      );

      var wb = XLSX.utils.table_to_book(
        document.getElementsByTagName("table")[1]
      );
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        var file = new Blob([wbout], { type: "application/octet-stream" });
        FileSaver.saveAs(file, "sheetjs.xlsx");
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    excelToJson() {
      document.getElementById("fileInput").click();
    },
    changeFile(obj) {
      var _self = this;
      var wb = "";
      if (!obj.target.files) {
        return;
      }
      var f = obj.target.files[0];
      var reader = new FileReader();
      reader.onload = e => {
        var data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(fixdata(data)), {
            //手动转化
            type: "base64"
          });
        } else {
          wb = XLSX.read(data, {
            type: "binary"
          });
        }
        console.log(wb);
        var worksheet = wb.Sheets[wb.SheetNames[0]];
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        for (let z in worksheet) {
          /* 带!的属性（比如!ref）是表格的特殊属性，用来输出表格的信息，不是表格的内容，所以去掉 */
          if (z[0] === "!") continue;

          // wb.Sheets[wb.SheetNames[0]][z].w = wb.Sheets[wb.SheetNames[0]][
          //   z
          // ].w.replace("\n", "");
        }
        _self.excelJson = JSON.stringify(
          XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        );
        console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    onloadExcel() {},
    // use js export
    exportToExcel() {
      var curTbl = document.getElementById("#out-table");
      var oXL = new ActiveXObject("Excel.Application");
      //创建AX对象excel
      var oWB = oXL.Workbooks.Add();
      //获取workbook对象
      var oSheet = oWB.ActiveSheet;
      //激活当前sheet
      var sel = document.body.createTextRange();
      sel.moveToElementText(curTbl);
      //把表格中的内容移到TextRange中
      sel.select();
      //全选TextRange中内容
      sel.execCommand("Copy");
      //复制TextRange中内容
      oSheet.Paste();
      //粘贴到活动的EXCEL中
      oXL.Visible = true;
      //设置excel可见属性
    },
    saveAs(obj, fileName) {
      //当然可以自定义简单的下载文件实现方式
      var tmpa = document.createElement("a");
      tmpa.download = fileName || "下载";
      tmpa.href = URL.createObjectURL(obj); //绑定a标签
      tmpa.click(); //模拟点击实现下载
      // this.isDownLoad = false
      setTimeout(() => {
        //延时释放
        URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
      }, 100);
    },
    jsonToSheet() {
      // var ws = XLSX.utils.json_to_sheet(this.tableData3);
      //		    	console.log(ws)
      //		    	var wbout = XLSX.write(ws, { bookType: 'xlsx', bookSST: true, type: 'array' })
      //		    	var file = new Blob([wbout], { type: 'application/octet-stream' })
      //				FileSaver.saveAs(file,  'tests.xlsx');
      /* bookType can be any supported output type */
      // var wopts = { bookType: "xlsx", bookSST: false, type: "array" };

      // var wbout = XLSX.write(ws, wopts);

      /* the saveAs call downloads a file on the local machine */
      // saveAs(
      //   new Blob([wbout], { type: "application/octet-stream" }),
      //   "testa.xlsx"
      // );
      // try {
      //   var file = new Blob([wbout], { type: "application/octet-stream" });
      //   FileSaver.saveAs(file, "tests.xlsx");
      // } catch (e) {
      //   if (typeof console !== "undefined") console.log(e, wbout);
      // }
      // return wbout;
      // var ws = XLSX.utils.json_to_sheet(
      //   [
      //     { S: 1, h: 2, e: 3, e_1: 4, t: 5, J: 6, S_1: 7 },
      //     { S: 2, h: 3, e: 4, e_1: 5, t: 6, J: 7, S_1: 8 }
      //   ],
      //   { header: ["S", "h", "e", "e_1", "t", "J", "S_1"] }
      // );
      let name = "testaa";
      let data = this.tableData3;
      const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
      const wb = { SheetNames: ["Sheet1"], Sheets: {}, Props: {} };
      wb.Sheets["Sheet1"] = XLSX.utils.json_to_sheet(data); //通过json_to_sheet转成单页(Sheet)数据
      this.saveAs(
        new Blob([this.s2ab(XLSX.write(wb, wopts))], {
          type: "application/octet-stream"
        }),
        name + "." + (wopts.bookType == "biff2" ? "xls" : wopts.bookType)
      );
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== "undefined") {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
    },
    async getStockPriceByName(name) {
      const symbol = await this.getStockSymbol(name);
      return symbol;
    },
    getStockSymbol(name) {
      return name;
    },
    getAsyncData() {
      this.getStockPriceByName("goog").then(result => {
        console.log(result);
      });
    },
    toJson() {
      var workbook = XLSX.readFile("../excel/test.xlsx");
      //				let excelJson = JSON.stringify( XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
      console.log(workbook);
    }
  },
  mounted() {
    this.mdFun();
  }
};
</script>

<style lang="scss" scoped="scoped">
#amap-box {
  .table-box {
    width: 100%;
    display: flex;
  }
}
</style>

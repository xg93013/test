import axios from 'axios';

let utils = {
    getProvinceGeo: (data) => {
        let arr = data.features;
        let jsonObj = {};
        for(let i = 0; i < arr.length; i++) {
            oneJson[arr[i].properties.name] = arr[i].properties.cp;
        }
        return jsonObj
    },
    // 导出excel
    downloadExcel: (data, title) => {
        // let fileName = decodeURI(data.headers["content-disposition"].split('=')[1]).replace(/\"/g, '');
        let fileName = title + '.xlsx';
        if('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);
        } else {
            let url = window.URL.createObjectURL(new Blob([data.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    // 导出
    exportExport: (e, data, urls) => {
        let uri = encodeURI(urls);
        let title = '';
        if (e.selectDate != '' && e.selectDate != undefined && e.selectDate != NaN) {
            title = e.selectDate + data.title;
        } else {
            title = data.title;
        }
        
        if (e.$refs[data.refName].btnText != '正在导出'){
            e.$refs[data.refName].btnText = '正在导出';
            setTimeout(() => {
                axios({
                    method: 'get',
                    url: uri,
                    responseType: 'blob'
                }).then((result) => {
                    utils.downloadExcel(result, title);
                    e.$refs[data.refName].btnText = '导出名单';
                }).catch((result) => {
                })
            }, 600)
        }
    }
}
export default utils
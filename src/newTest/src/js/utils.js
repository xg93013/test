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
    downloadExcel: (data) => {
        // console.log(data);
        let fileName = decodeURI(data.headers["content-disposition"].split('=')[1]).replace(/\"/g, '');
        let url = window.URL.createObjectURL(new Blob([data.data]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    // 导出
    exportExport: (e, data, urls) => {
        if (e.$refs[data.refName].btnText != '导出中...'){
            e.$refs[data.refName].btnText = '导出中...';
            setTimeout(() => {
                axios({
                    method: 'get',
                    url: urls,
                    responseType: 'blob'
                }).then((result) => {
                    utils.downloadExcel(result);
                    e.$refs[data.refName].btnText = '导出名单';
                }).catch((result) => {
                })
            }, 600)
        }
    }
}
export default utils

let mapPosition = {
    getProvinceGeo: (data) => {
        let arr = data.features
        let jsonObj = {}
        for(let i = 0; i < arr.length; i++) {
            oneJson[arr[i].properties.name] = arr[i].properties.cp
        }
        return jsonObj
    },
    convertGeoMap: (data) => {
        
    }
}
export default mapPosition
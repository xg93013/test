import {transform} from 'ol/proj.js';
import {Polygon as olPolygon} from 'ol/geom';

import {Polygon,TileLayer} from 'maptalks';
import regionModule from '@/data/region.js';


var gdalLayerConfig={
    resolutions : [
        0.000288,
        0.000144,
        0.000072,
        0.000036,
        0.000018,
        0.000009,
    ],
    fullExtent : [104.03919,30.54804,104.10048,30.586884],
    origin : [104.03919, 30.54804]
}
var gisMapLayerConfig={
    resolutions : [
        5.9486525145757E-4,
        2.97432625728785E-4,
        1.5228550437313792E-4,
        7.614275218656896E-5,
        3.807137609328448E-5
    ],
    // fullExtent : [103.91866560000001,30.544206600000006,104.2260804,30.8223174],
    fullExtent : [103.93263900000001,30.556848000000006,104.212107,30.809676],
    origin : [-400.0, 399.9999999999998]
}

// async function addGisLayer(map) {
//     var projection = getProjection('EPSG:4326');
//     // var projectionExtent = projection.getExtent();
//     // var size = getWidth(projectionExtent) / 256;
//     // var resolutions = new Array(14);
//     // var matrixIds = new Array(14);
//     // for (var z = 0; z < 14; ++z) {
//     //     // generate resolutions and matrixIds arrays for this WMTS
//     //     resolutions[z] = size / Math.pow(2, z);
//     //     matrixIds[z] = z;
//     // }

//     // var parser = new WMTSCapabilities();
//     // var text = await fetch('https://arcgis.gisserver.unionbigdata.net/arcgis/rest/services/1711/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(async response=>{
//     //     return await response.text();
//     // });

//     // var result = parser.read(text);
//     // var options = optionsFromCapabilities(result, {
//     //     layer: '1711',
//     //     matrixSet: 'EPSG:4326'
//     // });
//     // options.urls[0] = options.urls[0].replace("localhost","172.27.2.77");

    
//     // var mapExtent = transformExtent([104.039190, 30.535093, 104.100475, 30.586884], 'EPSG:4326', 'EPSG:3857');
//     var mapExtent = [104.039190, 30.535093, 104.100475, 30.586884]
//     var mapMinZoom = 12;
//     var mapMaxZoom = 17;

//     // var resolutions = [
//     //     5.9486525145757E-4,
//     //     2.97432625728785E-4,
//     //     1.5228550437313792E-4,
//     //     7.614275218656896E-5,
//     //     3.807137609328448E-5
//     // ]
//     // var fullExtent = [103.93263900000001,30.556848000000006,104.212107,30.809676];


//     // var origin = [-400.0, 399.9999999999998];
//     var chengduSensingLayer = new TileLayer({
//         source: new XYZ({
//             url: "https://182.150.44.163:8082/arcgis/rest/services/1711/MapServer/tile/{z}/{y}/{x}",
//             tileGrid : new TileGrid({
//                 tileSize: 256,
//                 origin: gisMapLayerConfig.origin,
//                 extent: gisMapLayerConfig.fullExtent,
//                 resolutions: gisMapLayerConfig.resolutions,
//                 // minZoom:2
//             }),
//             projection: projection,
//             // url: tileUrl,
//         }),
//         // zIndex:1,
//         // source: new WMTS(options),
        
//     });
//     var gdalLayer = new TileLayer({
//         opacity:.8,
//         source: new XYZ({
//             tileUrlFunction:function(){
//                 return "http://172.27.2.163/tiles/"+arguments[0][0]+"/"+arguments[0][1]+"/"+arguments[0][2]+".png"
//             },
//             tileGrid : new TileGrid({
//                 tileSize: [256,256],
//                 origin: gdalLayerConfig.origin,
//                 extent: gdalLayerConfig.fullExtent,
//                 resolutions: gdalLayerConfig.resolutions,
//             }),
//             projection: projection,
//         }),
//     });

//     map.addLayer(chengduSensingLayer);
//     map.addLayer(gdalLayer);
// }




// function commonView(){
//     return new View({
//             projection: "EPSG:4326",
//             center: [104.06868, 30.56122],
//             // 天府广场
//             // center: [104.070741, 30.639968],
//             // 选中的
//             // center: [104.123877,30.71688],
//             zoom: 14,
//         })
// }


function getFlatInteriorPoint(coos){
    // var tempCoos = (coos[0].length == 2 && !isNaN(coos[0][0])) ? [coos] : coos[0];
    var tempCoos = coos;
    var newGeom = new olPolygon(tempCoos);
    return newGeom.getFlatInteriorPoint();

    // var newMGeom = new olMultiPolygon(coos);
    // return newMGeom.getFlatInteriorPoints();
}

function WG8423857(coo){
    return transform(coo,"EPSG:4326","EPSG:3857");
}

// var easing = {
//     inAndOut,
//     easeIn,
//     easeOut
// }

var mapstalkOption = {
    config : {
        url:"https://182.150.44.163:8082/arcgis/rest/services/1711/MapServer/tile/{z}/{y}/{x}",
        resolutions:[
            5.9486525145757E-4,
            2.97432625728785E-4,
            1.5228550437313792E-4,
            7.614275218656896E-5,
            3.807137609328448E-5
        ],
        fullExtent:{
            'top': 30.809676,
            'left': 103.93263900000001,
            'bottom': 30.556848000000006,
            'right': 104.212107
        },
        tileSystem:[1,-1,-400.0,399.9999999999998]
    }
}

let getGisLayer = async function(type, county){
    let temp = regionModule.getConvexHull();
    let extentMerge;
    async function getConP () {
        return await temp;
    }
    function getCon () {
        return temp;
    }
    if (temp instanceof Promise) {
        extentMerge = await getConP();
    } else {
        extentMerge = getCon();
    }
    if (type == 'mask') {
        if (!county || county == 'all') {
            var mask = new Polygon(extentMerge.features[0].geometry.coordinates, {
                'symbol' : [
                    {
                    'lineWidth' : 0,
                    'polygonFillOpacity' : 0
                    },
                ]
            });
        } else {
            let temp = regionModule.getCounty(county);
            let tempCounty; 
            async function getContP () {
                return await temp;
            }
            function getCont () {
                return temp;
            }
            if (temp instanceof Promise) {
                tempCounty = await getContP();
            } else {
                tempCounty = getCont();
            }
            var mask = new Polygon(JSON.parse(tempCounty.shape.Shape).coordinates[0], {
                'symbol' : [
                    {
                    'lineWidth' : 0,
                    'polygonFillOpacity' : 0
                    },
                ]
            });
        }
        return mask;
    } else {
        var mask = new Polygon(extentMerge.features[0].geometry.coordinates, {
            'symbol' : [
                {
                'lineWidth' : 0,
                'polygonFillOpacity' : 0
                },
            ]
        });
        var extent = {
            ws:[104.03919,30.54804],
            en:[104.10048,30.586884]
        }
        var config = {
            // url:"http://172.27.2.163/chengdu_tiles/{z}/{x}/{y}.png",
            // url:'http://172.27.9.140/{z}/{x}/{y}.jpg',
            // url: 'http://172.24.59.39:8081/tiles/contrast-out/{z}/{x}/{y}.jpg',
            url: process.integration ? `${process.dataHost}/tiles/contrast-out/{z}/{x}/{y}.jpg` : 'http://182.150.44.163:8082/{z}/{x}/{y}.jpg',
            // url:'/contrast-out/{z}/{x}/{y}.jpg',
            resolutions:[
                0.000288,
                0.000144,
                0.000072,
                0.000036,
                0.000018,
                0.000009,
            ],
            fullExtent:{
                'top': WG8423857(extent.en)[1],
                'right': WG8423857(extent.en)[0],
                'left': WG8423857(extent.ws)[0],
                'bottom': WG8423857(extent.ws)[1],
            },
            tileSystem:[1,1,-20037508.34,-20037508.34],
        }
    }

    return (new TileLayer('gis', {
        zIndex:1,
        urlTemplate:config.url,
        noneImg: 'static/none.png',
        tileSystem:config.tileSystem,
        tileSize:[256,256],
        // crossOrigin:true,
        spatialReference:{
            projection : 'EPSG:3857',
            // resolutions:config.resolutions,
            fullExtent:config.fullExtent,
        },
        repeatWorld:false,
        background:false
    })).setMask(mask);
    // return (new WMSTileLayer('wms', {
    //     'urlTemplate' : 'http://10.190.239.132:8008/dsjbs234basemapraster/arcgis/services/BASEMAP/Raster/MapServer/WmsServer',
    //     'crs' : 'EPSG:4490',
    //     'layers' : '0',
    //     'styles' : '',
    //     'version' : '1.3.0',
    //     'format': 'image/png',
    //     // 'transparent' : true,
    //     // 'uppercase' : true
    // }))
    // return (new WMSTileLayer('wms', {
    //     'urlTemplate' : 'http://10.190.239.132:8008/dsjbs234thematicdatahlx/arcgis/services/THEMATICDATA/HLX/MapServer/WmsServer',
    //     'crs' : 'EPSG:4490',
    //     'layers' : '0',
    //     'styles' : '',
    //     'version' : '1.3.0',
    //     'format': 'image/png',
    //     // 'transparent' : true,
    //     // 'uppercase' : true
    // }))
}
// 简阳图层
async function getGisLayerJY () {
    var extent = {
        ws:[104.18630287999102,30.08897491765521],
        en:[104.89787767102223,30.64904163262635]
    }
    var config = {
        // http://172.27.9.140/jianyang-png-tiles/openlayers.html
        // url: 'http://172.24.59.39:8081/tiles/contrast-jianyan/{z}/{x}/{y}.png',
        url: process.integration ? `${process.dataHost}/tiles/contrast-jianyan/{z}/{x}/{y}.png` : 'http://182.150.44.163:8082/jianyang-png-tiles/contrast-jianyan/{z}/{x}/{y}.png',
        // url: '/contrast-jianyan/{z}/{x}/{y}.png',
        resolutions:[
            0.000288,
            0.000144,
            0.000072,
            0.000036,
            0.000018,
            0.000009,
        ],
        fullExtent:{
            'top': WG8423857(extent.en)[1],
            'right': WG8423857(extent.en)[0],
            'left': WG8423857(extent.ws)[0],
            'bottom': WG8423857(extent.ws)[1],
        },
        tileSystem:[1,1,-20037508.34,-20037508.34],
        repeatWorld:false,
        background:false
    }

    let temp = regionModule.getJianyang();
    let jianyangData;

    function getJYdata (){
        return temp;
    }
    async function getJYdataP (){
        return await temp;
    }
    if (temp instanceof Promise) {
        jianyangData = await getJYdataP();
    } else {
        jianyangData = getJYdata();
    }

    if (jianyangData) {
        var mask = new Polygon(JSON.parse(jianyangData.shape.Shape).coordinates[0], {
            'symbol' : [
                {
                'lineWidth' : 0,
                'polygonFillOpacity' : 0
                },
                {
                'lineWidth' : 0,
                'polygonFillOpacity' : 0
                }
            ]
        });
        return (new TileLayer('gisJY', {
            zIndex:2,
            urlTemplate:config.url,
            noneImg: 'static/none.png',
            tileSystem:config.tileSystem,
            tileSize:[256,256],
            // crossOrigin:true,
            spatialReference:{
                projection : 'EPSG:3857',
                // resolutions:config.resolutions,
                fullExtent:config.fullExtent,
            },
            repeatWorld:false
        })).setMask(mask);
    }
    return (new TileLayer('gisJY', {
        zIndex:2,
        urlTemplate:config.url,
        noneImg: 'static/none.png',
        tileSystem:config.tileSystem,
        tileSize:[256,256],
        // crossOrigin:true,
        spatialReference:{
            projection : 'EPSG:3857',
            // resolutions:config.resolutions,
            fullExtent:config.fullExtent,
        },
        repeatWorld:false
    }));
}

function getDSJBlayer () {
    var dashujubanLayer = new TileLayer('base', {
        'tileSystem' : [1, -1, -180, 90],
        'tileSize' : [256, 256],
        repeatWorld:false,
        zIndex:1,
        'urlTemplate' : 'http://10.190.239.132:8008/dsjbs234basemapraster/arcgis/rest/services/BASEMAP/Raster/MapServer/tile/{z}/{y}/{x}',
        // 'attribution' : '&copy; <a target="_blank" href="' + arcUrl + '"">ArcGIS</a>'
    })
    return dashujubanLayer;
}

let apiModel = {
    // addGisLayer,
    // commonView,
    // easing,
    getFlatInteriorPoint,
    mapstalkOption,
    transformProjection:WG8423857,
    getGisLayer,
    getGisLayerJY,
    getDSJBlayer
}



export default apiModel
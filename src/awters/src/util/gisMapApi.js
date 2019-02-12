// import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
// import TileLayer from 'ol/layer/Tile';
// import XYZ from 'ol/source/XYZ';
// import TileGrid from 'ol/tilegrid/TileGrid';
// import View from 'ol/View';
// import {inAndOut,easeIn, easeOut} from 'ol/easing';
// import Feature from 'ol/Feature';
import {transform,get as getProjection} from 'ol/proj.js';
import {Polygon as olPolygon, MultiPolygon as olMultiPolygon} from 'ol/geom';

import {Polygon,TileLayer,WMSTileLayer} from 'maptalks/dist/maptalks';
import extentMerge from '@/data/convex_hull.json';

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

async function addGisLayer(map) {
    var projection = getProjection('EPSG:4326');
    // var projectionExtent = projection.getExtent();
    // var size = getWidth(projectionExtent) / 256;
    // var resolutions = new Array(14);
    // var matrixIds = new Array(14);
    // for (var z = 0; z < 14; ++z) {
    //     // generate resolutions and matrixIds arrays for this WMTS
    //     resolutions[z] = size / Math.pow(2, z);
    //     matrixIds[z] = z;
    // }

    // var parser = new WMTSCapabilities();
    // var text = await fetch('https://arcgis.gisserver.unionbigdata.net/arcgis/rest/services/1711/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(async response=>{
    //     return await response.text();
    // });

    // var result = parser.read(text);
    // var options = optionsFromCapabilities(result, {
    //     layer: '1711',
    //     matrixSet: 'EPSG:4326'
    // });
    // options.urls[0] = options.urls[0].replace("localhost","172.27.2.77");

    
    // var mapExtent = transformExtent([104.039190, 30.535093, 104.100475, 30.586884], 'EPSG:4326', 'EPSG:3857');
    var mapExtent = [104.039190, 30.535093, 104.100475, 30.586884]
    var mapMinZoom = 12;
    var mapMaxZoom = 17;

    // var resolutions = [
    //     5.9486525145757E-4,
    //     2.97432625728785E-4,
    //     1.5228550437313792E-4,
    //     7.614275218656896E-5,
    //     3.807137609328448E-5
    // ]
    // var fullExtent = [103.93263900000001,30.556848000000006,104.212107,30.809676];


    // var origin = [-400.0, 399.9999999999998];
    var chengduSensingLayer = new TileLayer({
        source: new XYZ({
            url: "https://182.150.44.163:8082/arcgis/rest/services/1711/MapServer/tile/{z}/{y}/{x}",
            tileGrid : new TileGrid({
                tileSize: 256,
                origin: gisMapLayerConfig.origin,
                extent: gisMapLayerConfig.fullExtent,
                resolutions: gisMapLayerConfig.resolutions,
                // minZoom:2
            }),
            projection: projection,
            // url: tileUrl,
        }),
        // zIndex:1,
        // source: new WMTS(options),
        
    });
    var gdalLayer = new TileLayer({
        opacity:.8,
        source: new XYZ({
            tileUrlFunction:function(){
                return "http://172.27.2.163/tiles/"+arguments[0][0]+"/"+arguments[0][1]+"/"+arguments[0][2]+".png"
            },
            tileGrid : new TileGrid({
                tileSize: [256,256],
                origin: gdalLayerConfig.origin,
                extent: gdalLayerConfig.fullExtent,
                resolutions: gdalLayerConfig.resolutions,
            }),
            projection: projection,
        }),
    });

    map.addLayer(chengduSensingLayer);
    map.addLayer(gdalLayer);
}




function commonView(){
    return new View({
            projection: "EPSG:4326",
            center: [104.06868, 30.56122],
            // 天府广场
            // center: [104.070741, 30.639968],
            // 选中的
            // center: [104.123877,30.71688],
            zoom: 14,
        })
}


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

let getGisLayer = function(type){
    var extent = {
        ws:[104.03919,30.54804],
        en:[104.10048,30.586884]
    }
    var config = {
        // url:"http://172.27.2.163/chengdu_tiles/{z}/{x}/{y}.png",
        // url:'http://172.27.9.140/{z}/{x}/{y}.jpg',
        url:'http://182.150.44.163:8082/{z}/{x}/{y}.jpg',
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
    var mask = new Polygon(extentMerge.features[0].geometry.coordinates, {
        'symbol' : [
            {
            'lineColor' : '#ccc',
            'lineWidth' : 8,
            'polygonFillOpacity' : 0
            },
            {
            'lineColor' : '#404040',
            'lineWidth' : 6,
            'polygonFillOpacity' : 0
            }
        ]
    });
    var outline = mask.copy();
    if (type == 'mask') {
        return outline;
    }
    return (new TileLayer('gis', {
        zIndex:1,
        urlTemplate:config.url,
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

let apiModel = {
    // addGisLayer,
    // commonView,
    // easing,
    getFlatInteriorPoint,
    mapstalkOption,
    transformProjection:WG8423857,
    getGisLayer
}



export default apiModel
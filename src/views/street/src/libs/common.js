import _ from 'lodash';
function test(argument) {
    
}

if (module && !module.hot) {
    test();
    // return;
}

var enumeration = {
        platform : {
            takeout : 1,
            grouppurchase : 2
        }
    },
    color = {
        baidu : {
            main : "#1589F4",
            sub : "#096ECC",
            // 百度外卖实际颜色
            takeout : "#ff2d4b",
            grouppurchase: "#ff318c"
        },
        meituan:{
            main : "#FF3EA6",
            sub : "#E91A6A",
            takeout : "#2bb8aa",
            grouppurchase: "#ffd161"
        },
        eleme :{
            main : "#23CDAB",
            sub : "#0B9277",
            takeout : "#008de1",
            // grouppurchase: "#008de1"
        },
        1 : {
            "百度" : "rgba(152,101,229,1)",
            "饿了么" : "rgba(21,137,244,1)",
            "美团" : "rgba(101,101,229,1)"
        },
        2 : {
            "百度糯米" : "rgba(35,205,171,1)",
            "大众点评" : "rgba(220,73,104,1)",
            "美团" : "rgba(94,156,250,1)"
        },
        "百度" : "rgba(152,101,229,1)",//(外卖)
        "饿了么" : "rgba(21,137,244,1)",
        "百度糯米" : "rgba(35,205,171,1)",
        "大众点评" : "rgba(220,73,104,1)",
        "美团" : "rgba(94,156,250,1)",
        "美团外卖" : "rgba(101,101,229,1)",
        takeout : "rgba(226,83,113,1)",
        grouppurchase : "rgba(21, 137, 244, 1)",
        notPublic : "rgba(21,137,244,1)",
        notIdentify : "rgba(35,205,171,1)",
        outRange : "rgba(255,62,166,1)"
    }

export {enumeration, color};
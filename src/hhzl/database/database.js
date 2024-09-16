'use strict';

const fs = require('fs');
const path = require('path');
const rootDatapath = './src/';

let resultJson = [];
fs.readdir(path.join(__dirname, rootDatapath), function (err, months) {
    months.sort((a, b)=>b * 1 - a * 1).forEach((month, mIndex) => {
        fs.stat(path.join(__dirname,rootDatapath + month), async (err, stats) => {
            if (stats.isDirectory()) {
                let tempData = {
                    date : month
                }

                fs.readdir(path.join(__dirname, rootDatapath + month), (err, files) => {
                    var targetList = ["mmmm_manager_resource.json", "mmmm_water_pollution.json"];
                    files.forEach((fileName)=>{
                        if (targetList.includes(fileName)) {
                            tempData[fileName.split('.')[0]] = require(path.join(__dirname, rootDatapath + month + '/' + fileName));
                        }
                        if (mIndex == 0) {
                            fs.open(path.resolve('src/data/mmmm_resource.json'), 'w', (e, fd) => {
                                var tempResource = require(path.join(__dirname, rootDatapath + month + '/mmmm_resource.json'));
                                fs.write(fd, JSON.stringify(tempResource), function () {
                                    fs.closeSync(fd);
                                })
                            });
                        }
                    });
                    resultJson.push(tempData);
                    if (months.length == mIndex + 1) {
                        console.log(resultJson);
                        fs.open(path.resolve('src/data/data.json'), 'w', (e, fd) => {
                            fs.write(fd, JSON.stringify(resultJson), function () {
                                fs.closeSync(fd);
                            })
                        });
                    }
                });

            }
        })
    });
});
let cache = {};
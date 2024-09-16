const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// 每次构建清理dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const fs = require('fs');

fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});
fs.open('./src/config/pathConfig.js', 'w', function (err, fd) {
    const buf = 'module.exports = {path:"development"} ;';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});

const webpackBaseConfig = require('./webpack.base.config.js');

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        // path : path.resolve(__dirname, './dist'),
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    devServer : {
        host: '172.27.2.178',
        port: '6868',
        hot: true,
        compress: true,
        historyApiFallback: true,
        clientLogLevel: 'warning',
        proxy : {
            "/dev":{
                // target: "http://172.27.2.191:8083",
                target: "http://172.27.2.186:8080",
                pathRewrite: {"^/dev" : ""}
            }
        }
    },
    plugins: [
        // 构建前清理dist目录
        // new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});
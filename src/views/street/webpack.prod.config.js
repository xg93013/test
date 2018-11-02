const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次构建清理dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const fs = require('fs');

fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});
fs.open('./src/config/pathConfig.js', 'w', function (err, fd) {
    const buf = 'module.exports = {path:"production"} ;';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});

const webpackBaseConfig = require('./webpack.base.config.js');

module.exports = merge(webpackBaseConfig, {
	devtool: '#source-map',
    output: {
        path : path.resolve(__dirname, './dist'),
        filename: 'static/js/[name].[hash].js',
        chunkFilename: 'static/js/[name].[hash].chunk.js'
    },
    plugins: [
        // 构建前清理dist目录
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: 'static/css/[name].[hash].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'static/js/vendors.[hash].js'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/template/index.ejs',
            inject: false
        })
    ]
});
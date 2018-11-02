const path = require('path');
const config = require('./src/config/pathConfig.js');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log(config.path)
const pathPublic = config.path == "production" ? '../../' : '../../dist/'; // dev publicPath


module.exports = {
    entry: {
        main: ['babel-polyfill','./src/main'],
        vendors: './src/vendors'
    },
    output: {
        path: path.join(__dirname, './dist'),
        publicPath:'./'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                less: ExtractTextPlugin.extract({
                                    use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                                    publicPath: pathPublic,
                                    fallback: 'vue-style-loader'
                                }),
                                css: ExtractTextPlugin.extract({
                                    use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
                                    publicPath: pathPublic,
                                    fallback: 'vue-style-loader'
                                }), 
                                scss:ExtractTextPlugin.extract({
                                    use: ['css-loader', 'autoprefixer-loader', 'sass-loader'],
                                    publicPath: pathPublic,
                                    fallback: 'style-loader'
                                })
                            }
                        }
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader'],
                    publicPath: pathPublic,
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                    publicPath: pathPublic,
                    fallback: 'style-loader'
                })
            },{
            // sass loader
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({

                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // 在开发环境使用 style-loader,将css样式添加为内联样式
                    fallback: "style-loader",
                    publicPath: pathPublic,
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            "@":path.join(__dirname, 'src')
        }
    },
    externals: {
        'AMap': 'AMap'
    }
};
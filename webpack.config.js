const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');    // 将样式提取到单独的css文件里面
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const autoprefixer = require('autoprefixer');

const rootDir = path.resolve(__dirname, './');
const buildDir = path.resolve(rootDir, './build');
const staticDir = path.resolve(buildDir, './static');
const viewDir = path.resolve(buildDir, './views');


function getEntries() {
    // 获得入口文件，我们约定入口文件为/static/js/page/**/index.js
    // 同步获得
    const entries = {};
    glob.sync('./src/static/js/page/**/index.js').map((file) => {
        const tmp = file;
        const entryName = tmp.replace('./src/static/js/page/', '').replace('/index.js', '');
        entries[entryName] = file;
    });

    return entries;
}

const entries = getEntries();

function getHtmlWepackPlugin() {
    // 插入css/js等生成最终HTML
    const plugins = []

    Object.keys(entries).map((name) => {
        const template = `./src/views/${name}.html`;
        const files = glob.sync(template);
        if (files && files.length > 0) {
            plugins.push(new HtmlWebpackPlugin({
                filename: `${viewDir}/${name}.html`,
                template,
                chunks: [name]
            }));
        }
    });
    return plugins;
}

const alias = {
    'httpClient': path.resolve(__dirname, './src/static/js/lib/http-client.js'),
    'reset': path.resolve(__dirname, './src/static/js/common/global.scss')
}

module.exports = {
    resolve: {
        alias
    },
    entry: entries,    // 入口文件
    output: {
        path: buildDir,
        publicPath: '/static',
        filename: './js/[name].js'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["react", ['es2015', {loose: true}], 'stage-0'],
                        plugins: [
                            'transform-remove-strict-mode',
                            'transform-class-properties'
                        ]
                    }
                }]
            }, {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            }, {
                test: /\.css$/,
                use:  ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader'})
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader'})
            }, {
                test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/,
                use: [{
                    loader: 'file-loader'
                }]
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer]
            }
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.HotModuleReplacementPlugin()
    ]
    ,devServer: {
        host: 'localhost',
        publicPath: '/static',
        port: 9090,
        hot: true,
        quiet: false,
        noInfo: true,
        proxy: {
            // 将请求转到express
            '*': {
                target: 'http://localhost:3000'
            }
        }
    }
}
const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        homepage: path.resolve(__dirname, 'src/homepage.js')
    }, //入口文件
    output: {
        path: path.resolve(__dirname),
        filename: 'dist/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.(js)$/,
                exclude: '/node_modules/',
                include: '/src/',
                use: [{
                    loader: 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true
                    }
                }]
            },
            {
                test: /\.vue$/,
                loaders: [
                    'vue-loader'
                ],
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                loaders: [
                    'url-loader'
                ]
            }
        ]
    },
    devtool: "inline-source-map",
    //插件
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.ProvidePlugin({
            $: 'zepto-webpack',
            Vue: 'vue/dist/vue.common.js'
        }),
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        alias: {
            mBasic: '@ths/mbasic'
        }
    },
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        contentBase: path.resolve(__dirname),
        hot: true,
        inline: true,
        compress: true,
        host: 'localhost',
        port: 8080
    }
};

const webpack = require('webpack'); //
const path = require('path'); //правильные пути указывать
const HtmlWebpackPlugin = require('html-webpack-plugin'); //Плагин для HTLM npm install html-webpack-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //Плагин для CSS
const mode = process.env.NODE_ENV || 'development'; //указание среды разработки ()

const CopyWebpackPlugin = require("copy-webpack-plugin");
const package = require('./package.json');

const devMode = mode === 'development'; // Проверка мода на девелопмент

const target = devMode ? 'web' : 'browserslist'; // Если development, то web настройки, если продакшн, то файл browserslistrc
const devtool = devMode ? 'source-map' : undefined; // При дев моде, будет source-map для отслежиания ошибок 

function modify(buffer) {
    let manifest = JSON.parse(buffer.toString());

    manifest.version = package.version;

    manifest_JSON = JSON.stringify(manifest, null, 2);
    return manifest_JSON;
}

module.exports = {
    mode, //Мод (дев или прод)
    target, // ресурс (web или browserslistrc)
    devtool, // отслеживание ошибок
    devServer: {
        port: 3000, //Порт
        open: true, //Открывать браузер
        hot: true, //Обновление стилей (бывают сложности)
    },
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')], //npm install --save @babel/polyfill : для поддержки скриптов из браузеров
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: 'index.js', //name - main по умолчанию, contentnpmhash нужен для сборки разных имен, чтобы обновление было из разных файлов
    },
    module: {
        rules: [
            { //npm install --save-dev html-loader
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {//npm install --save-dev @babel/core @babel/preset-env babel-loader
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env'],
                }
            },
            {//npm install --save-dev css-loader sass-loader sass
                test: /\.(c|sc|sa)ss$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader, //npm install style-loader -D
                    "css-loader",
                    { // npm install --save-dev postcss-loader postcss postcss-preset-env (Префиксы)
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            }
                        }
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(woff2|woff)?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(svg|jpg)$/,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: "./src/languages.json",
                        to: "./languages.json",
                        transform(content, path) {
                            return modify(content)
                        }
                    }
                ]
            })
    ]
};

//npm i scss-reset --save; почистить html
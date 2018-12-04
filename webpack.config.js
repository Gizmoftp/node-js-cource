const path = require('path');
const webpack = require('webpack');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

console.log(process.env.NODE_ENV);

let entry = PRODUCTION 
? [  './index.js']
: [
    './index.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
];

let plugins = PRODUCTION 
? []
: [   new webpack.HotModuleReplacementPlugin()];

module.exports = {
    mode : process.env.NODE_ENV,
    entry: entry,
    plugins : plugins,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.(png|jpg|gif)$/,
            exclude : '/node_modules/',
            use: {
              loader: 'file-loader',
            }
          },
          {
            test: /\.css$/,
            exclude : '/node_modules/',
            use: ['style-loader','css-loader']
            
          }
        ]
    }
};
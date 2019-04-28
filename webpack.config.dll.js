const option = require("./config");
const webpack = require('webpack');
const path = require('path');
const CleanWebpaclPlugin = require('clean-webpack-plugin');

// 计时
const smp = new(require("speed-measure-webpack-plugin"))();

const builderConfig = require("./scripts/dll");
const Builder = require("./scripts/builder");

let builder = new Builder(path.join(__dirname, 'build/dll'), option.library);
builder.setEntry("vendor", option.dll);
builder.usePlugin([
    new CleanWebpaclPlugin(),
    new webpack.DllPlugin({
        path: path.join(__dirname, 'build/dll', '[name]-manifest.json'),
        name: `[name]_Dll`,
    }),
]);
module.exports = smp.wrap(builder.Config(builderConfig));
const option = require("../config");
const webpack = require('webpack');
const path = require('path');
const CleanWebpaclPlugin = require('clean-webpack-plugin');
const devPath = require("./path");

// 计时
const smp = new(require("speed-measure-webpack-plugin"))();

const builderConfig = require("./dll");
const Builder = require("./builder");

let builder = new Builder(path.join(devPath.root, 'build/dll'), option.library);
builder.setEntry("vendor", option.dll);
builder.usePlugin([
    new CleanWebpaclPlugin(),
    new webpack.DllPlugin({
        path: path.join(devPath.root, 'build/dll', '[name]-manifest.json'),
        name: `[name]_Dll`,
    }),
]);
module.exports = smp.wrap(builder.Config(builderConfig));
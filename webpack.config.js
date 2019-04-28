const option = require("./config");
const path = require('path');
const webpack = require('webpack');
const CleanWebpaclPlugin = require('clean-webpack-plugin');
// 缓存,待使用
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// css提取处理，待使用
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 打包分析，分析各个module所占用的大小
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 类型检查
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// 文件复制
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 进度条
const WebpackBar = require('webpackbar');

// 计时
const smp = new(require("speed-measure-webpack-plugin"))();


const builderConfig = require("./scripts");
const Builder = require("./scripts/builder");
let builder = new Builder(path.resolve(__dirname, "build"), option.library, path.resolve(__dirname, "src/pages"));
builder.useLoader(require("./scripts/loaders/style")());
builder.usePlugin([
    new CleanWebpaclPlugin(),
    new WebpackBar(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{
        from: 'src/assets',
        to: 'assets/'
    }]),
]);
builder.useTSLoader(path.resolve(__dirname, "src"));
builder.setAlias({
    "@src": path.resolve(__dirname, "src"),
    "@components": "@src/components",
    "@services": "@src/services",
    "@config": "@src/config"
});

builder.splitChunks("Commons", {
    name: "common", // 
    chunks: 'all', // 模式
    priority: 0,
    minChunks: 2 //最少引用次数，提取
    // test 范围，路径，正则表达式
    // priority 优先级
    // minSize 最小尺寸
});

builder.splitChunks("vendor", {
    chunks: "all",
    test: path.resolve(__dirname, "node_modules"),
    name: "vendor",
    enforce: true,
    priority: 10
});


builder.beforeBuilder((config, env, options) => {
    if (option.mock) {
        builder.globalImport("@services/mock");
    }
    if (options.mode === Builder.Mode.development) {
        // builder.usePlugin([new webpack.DllReferencePlugin({
        //         // 描述 lodash 动态链接库的文件内容
        //         manifest: require('./build/dll/vendor-manifest.json')
        //     })
        // ]);
    } else {
        builder.userMinimizer(require("./scripts/plugins/uglifyjs"));
    }
});

// builder.useHtmlPlugin(path.resolve(__dirname, "src/html"), option.scripts, option.css);
option.typeCheck && builder.usePlugin(new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true
}));
option.polyfill && builder.globalImport("@babel/polyfill");
option.analyzer && builder.usePlugin(new BundleAnalyzerPlugin());


module.exports = smp.wrap(builder.Config(builderConfig));
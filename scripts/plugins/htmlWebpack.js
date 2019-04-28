const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function htmlPlugin({
    entry,
    plugins,
    scripts = [],
    css = [],
    path
}) {
    // 读取、设置html文件注入js
    let entryKeys = Object.keys(entry);
    let htmlFiles = fs.readdirSync(path)
    entryKeys.forEach((key) => {
        if (htmlFiles.includes(`Template.html`)) {
            let path = entry[key];
            let pageInfo = require(`${Array.isArray(path) ? path[path.length - 1] : path}/pageinfo`);
            plugins.push(new HtmlWebpackPlugin({
                title: pageInfo.title ? pageInfo.title : key,
                filename: `html/${key}.html`,
                template: `src/html/Template.html`,
                inject: "body",
                chunks: ["vendor", "common", key],
                scripts: [...scripts, ...pageInfo.scripts],
                css: [...css, ...pageInfo.css]
                // favicon 引入的favicon
                // chunks 引用哪些js   多个html则使用多次调用
                // title html标题
            }));
        }
    });
}

module.exports = htmlPlugin;
// 建立对应的配置文件 postcss.config.js，使用对应的插件实现对应的功能。
module.exports = {
    plugins: [
        require('precss'), // 让css支持类似sass的语法,vscode在设置json中增加 "files.associations": { "*.css": "scss" }
        require('autoprefixer')({ // 自动补全浏览器前缀
            browsers: ["defaults", "ie >= 10"]
        }),
        // postcss-preset-env // 允许使用新特性，类似babel
    ]
}
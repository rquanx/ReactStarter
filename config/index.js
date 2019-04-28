let config = {
        htmlTemplate: false,
        // 是否打包mock
        mock: false,
        // 是否打包polyfill
        polyfill: true,
        // 是否启动打包分析
        analyzer: false,
        // 是否进行类型检查
        typeCheck: false,
        // 项目名
        library: "Test",
        scripts: [],
        css: ["../assets/css/Common.css"],
        // dll要打包的模块,待完善
        dll: ["react", 'react-dom',
                "@babel/polyfill",
                "axios",
        ]
}
module.exports = config;
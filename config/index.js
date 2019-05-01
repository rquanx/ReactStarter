let config = {
        SPA: false,
        htmlTemplate: {
                // 是否启用模板生成，没改动时关闭，加快打包
                enable: true,
                // 注入到模板的script
                scripts: ["../dll/CarsgenRecordManagement.vendor.js"],
                // 注入到目标的css
                css: ["../assets/css/Common.css"],
        },
        // 是否打包mock
        mock: false,
        // 是否打包polyfill,只对Product打包生效
        polyfill: true,
        // 是否启动打包分析
        analyzer: false,
        // 是否进行类型检查
        typeCheck: false,
        // 项目名
        library: "CarsgenRecordManagement",

        // dll要打包的模块,将引入的第三方模块写入数组中,
        dll: Array.from(new Set([
                "react", 'react-dom', "@babel/polyfill", "axios",
                "@fortawesome/react-fontawesome", // Pagination
                "@fortawesome/free-solid-svg-icons", // Pagination

                // 逐个引入
                // "office-ui-fabric-react/lib/Dialog",    // Notification
                // 'office-ui-fabric-react/lib/Modal',    // Notification
                // "office-ui-fabric-react/lib/Button",    // Notification
                // "office-ui-fabric-react/lib/Icons",    // Notification
                // 'office-ui-fabric-react/lib/Spinner',   // loading

                // 'office-ui-fabric-react/lib/DatePicker',
                // 'office-ui-fabric-react/lib/Label',
                // 'office-ui-fabric-react/lib/Dropdown',
                // 'office-ui-fabric-react/lib/TextField',
                // 'office-ui-fabric-react/lib/Nav',
                // "office-ui-fabric-react/lib/Pickers",

                // 引入整个office-ui-fabric-react，Pickers需要单独声明
                "office-ui-fabric-react/lib/Pickers",
                "office-ui-fabric-react/lib" // 或"office-ui-fabric-react"
        ]))
}
module.exports = config;
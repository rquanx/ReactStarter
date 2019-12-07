module.exports = {
    normal:{
        test: new RegExp(`^(?!.*\\.module).*\\.css`),
        exclude: "/node_modules",
        use: [
            "cache-loader",
            "style-loader",
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require("postcss-import"),
                        require('precss'), // 让css支持类似sass的语法,vscode在设置json中增加 "files.associations": { "*.css": "scss" }
                        require('autoprefixer'),
                        // postcss-preset-env // 允许使用新特性，类似babel
                    ]
                }
            }
        ]
    },
    modules: {
        test:  new RegExp(`^(.*\\.module).*\\.css`),
        exclude: "/node_modules",
        use: [
            "cache-loader",
            "style-loader?sourceMap",
            "css-loader?modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require("postcss-import"),
                        require('precss'), // 让css支持类似sass的语法,vscode在设置json中增加 "files.associations": { "*.css": "scss" }
                        require('autoprefixer'),
                        // require('postcss-modules'),
                        // postcss-preset-env // 允许使用新特性，类似babel
                    ]
                }
            }
        ]
    }
}
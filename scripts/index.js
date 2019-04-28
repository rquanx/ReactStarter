function builderConfig(builder) {
    return {
        entry: builder.entry,
        optimization: {
            minimizer: builder.minimizer,
            splitChunks: {
                cacheGroups: builder.cacheGroups
            }
        },
        output: {
            path: builder.initalObj.path,
            filename: `js/${builder.initalObj.library}.[name].js`,
            library: builder.initalObj.library,
            libraryTarget: "var",
            hotUpdateChunkFilename: 'hot/hot-update.js',
            hotUpdateMainFilename: 'hot/hot-update.json'
        },
        // Enable sourcemaps for debugging webpack's output.
        devtool: "cheap-source-map",
        devServer: {
            contentBase: builder.initalObj.path,
            hot: true, //热替换
            open: true, // 默认打开浏览器  === 脚本运行时使用--open,
            port: "8080", //默认端口
            inline: true, //自动刷新
        },
        plugins: builder.plugins,
        bail: true,
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".css", ".js", ".json"],
            alias: builder.alias
        },

        module: {
            rules: builder.loaders
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {
            // "react": "React",
            // "react-dom": "ReactDOM"
        }
    };
}

module.exports = builderConfig;
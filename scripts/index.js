// const entryConfig = require("./entry");
// const htmlPlugin = require("./plugins/htmlWebpack");
// const tsLoader = require("./loaders/ts");
// let entry = {}; // entryConfig.getEntry("./src/pages/");
// let plugins = [];
// let loaders = [];
// let cacheGroups = {};
// let alias = {};
// let initalObj = {
//     path: "",
//     library: "",
// };
// let callList = [];

// function pushList(list, ele) {
//     if (Array.isArray(ele)) {
//         list = [...list, ...ele];
//     } else {
//         list.push(ele);
//     }
// }

// let Bundle = {
//     Mode: {
//         development: "development",
//         production: "production",
//         none: "none"
//     },
//     /**
//      * 
//      * @param {string} buildPath 
//      * @param {string} libName 
//      * @param {string} entryPath 
//      */
//     inital(buildPath, libName, entryPath) {
//         initalObj["path"] = buildPath;
//         initalObj["library"] = libName;
//         entry = entryConfig.getEntry(`${entryPath}\\`);
//     },
//     setAlias(key, path) {
//         if (path) {
//             alias[key] = path;
//         } else {
//             alias = key;
//         }
//     },
//     globalImport(importList) {
//         entryConfig.globalImport(entry, importList);
//     },
//     usePlugin(plugin) {
//         pushList(plugins, plugin);
//     },
//     useLoader(loader) {
//         pushList(loaders, loader);
//     },
//     /**
//      * 
//      * @param {string} path 
//      */
//     useHtmlPlugin(path) {
//         htmlPlugin(entry, path, plugins);
//     },
//     /**
//      * 
//      * @param {string} path 
//      */
//     useTSLoader(path) {
//         tsLoader(entry, plugins, loaders, path)
//     },
//     Config(env, options) {
//         let config = {
//             entry,
//             optimization: {
//                 splitChunks: {
//                     cacheGroups
//                 }
//             },
//             output: {
//                 path: initalObj.path,
//                 filename: `js/${initalObj.library}.[name].js`,
//                 library: initalObj.library,
//                 libraryTarget: "var",
//                 hotUpdateChunkFilename: 'hot/hot-update.js',
//                 hotUpdateMainFilename: 'hot/hot-update.json'
//             },
//             // Enable sourcemaps for debugging webpack's output.
//             devtool: "cheap-source-map",
//             devServer: {
//                 contentBase: initalObj.path,
//                 hot: true, //热替换
//                 open: true, // 默认打开浏览器  === 脚本运行时使用--open,
//                 port: "8080", //默认端口
//                 inline: true, //自动刷新
//             },
//             plugins,
//             resolve: {
//                 // Add '.ts' and '.tsx' as resolvable extensions.
//                 extensions: [".ts", ".tsx", ".css", ".js", ".json"],
//                 alias
//             },

//             module: {
//                 rules: loaders
//             },

//             // When importing a module whose path matches one of the following, just
//             // assume a corresponding global variable exists and use that instead.
//             // This is important because it allows us to avoid bundling all of our
//             // dependencies, which allows browsers to cache those libraries between builds.
//             externals: {
//                 // "react": "React",
//                 // "react-dom": "ReactDOM"
//             }
//         };
//         callList.forEach((fun) => {
//             fun(config, env, options);
//         });
//         return config;
//     },
//     splitChunks(key, options) {
//         cacheGroups[key] = options;
//     },
//     beforeBundle(fun) {
//         callList.push(fun);
//     }
// }
// module.exports = Bundle;

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
// let entry = {};
// let plugins = [];
// let initalObj = {
//     path: "",
//     library: "",
// };

// let Bundle = {
//     inital(buildPath, libName = "") {
//         initalObj["path"] = buildPath;
//         initalObj["library"] = libName;
//     },
//     setEntry(key, enpoint) {
//         if (enpoint) {
//             entry[key] = enpoint;
//         } else {
//             entry = key;
//         }
//     },
//     usePlugin(plugin) {
//         pushList(plugins, plugin);
//     },
//     Config() {
//         let config = {
//             mode: 'production',
//             entry,
//             output: {
//                 path: initalObj.path,
//                 filename: '[name].dll.js',
//                 library: '[name]',
//             },
//             plugins: plugins
//         }
//         return config;
//     }
// }


// module.exports = Bundle;


function builderConfig(builder) {
    return {
        mode: 'production',
        entry: builder.entry,
        output: {
            path: builder.initalObj.path,
            filename: `${builder.initalObj.library ? builder.initalObj.library : ""}.[name].js`,
            library: '[name]_Dll',
        },
        plugins: builder.plugins
    };
}

module.exports = builderConfig;
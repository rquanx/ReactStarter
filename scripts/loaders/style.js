function styleLoader() {
    return {
        test: /\.css$/,
        exclude: "/node_modules",
        use: [
            "cache-loader",
            "style-loader",
            "style-loader",
            'postcss-loader'
        ]
        // use: [{
        //         loader: "style-loader"
        //     },
        //     {
        //         loader: "css-loader",
        //         options: {
        //             importLoaders: 1,
        //         }
        //     },
        //     {
        //         loader: 'postcss-loader'
        //     }
        // ]
    };
}


module.exports = styleLoader
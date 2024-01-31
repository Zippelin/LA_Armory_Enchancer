const path = require("path");

module.exports = {
    entry: {
        content: "./src/scripts/content.ts",
        background: "./src/scripts/background.ts",
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "scripts/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 4000,
    },
};

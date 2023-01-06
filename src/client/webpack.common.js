const path = require('path')

module.exports = {
    entry: './src/client/client.js',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.mp3|.wav$/,
                loader: 'file-loader'
            },
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    },
}
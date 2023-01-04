const path = require('path')

module.exports = {
    entry: './src/client/client.js',
    module: {
        rules: [
            {
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    },
}
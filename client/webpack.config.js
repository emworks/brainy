const path = require('path');

module.exports = {
    // devtool: 'source-map',
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src/')
        }
    },
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'js/dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}
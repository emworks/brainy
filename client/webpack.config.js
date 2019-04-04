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
        path: path.join(__dirname, 'public/dist'),
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
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
}
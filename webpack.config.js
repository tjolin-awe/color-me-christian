const path = require('path');

module.exports = {
    entry: {
        app: './src/main.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    },

    //devtool: 'inline-source-map'
}
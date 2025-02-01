const path = require('path');

module.exports = {
    entry: {
        form: './src/form/index.js',
        step: './src/step/index.js',
        fields: './src/fields/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name]/index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};

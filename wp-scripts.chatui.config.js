const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production', // or 'development' as needed
  entry: {
    'smartforms-chat': './src/chat-ui/smartforms-chat.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    // Copy extra dynamic files from each block folder, preserving folder structure.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/dynamic.php',
          context: path.resolve(__dirname, 'src/blocks'),
          to: 'blocks/[path][name][ext]',
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            ignore: ['**/node_modules/**']
          }
        },
        {
          from: '**/frontend.js',
          context: path.resolve(__dirname, 'src/blocks'),
          to: 'blocks/[path][name][ext]',
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            ignore: ['**/node_modules/**']
          }
        },
        {
          from: '**/buttonGroupHelper.js',
          context: path.resolve(__dirname, 'src/blocks'),
          to: 'blocks/[path][name][ext]',
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            ignore: ['**/node_modules/**']
          }
        }
      ]
    })
  ]
};

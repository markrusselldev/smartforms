// wp-scripts.config.js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry,
    'smartforms-chat': './src/chat-ui/smartforms-chat.js'
  },
  output: {
    path: __dirname + '/build',
    filename: 'js/[name].js',
  },
  plugins: [
    ...defaultConfig.plugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};

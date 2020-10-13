const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin')
  .default
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const outputPath = path.join(__dirname, 'dist')

module.exports = (env, argv) => {
  return {
    entry: {
      index: path.join(__dirname, 'src', 'index.js'),
    },
    output: {
      path: outputPath,
      filename: 'main.js',
    },
    mode: env || 'development',
    devtool: argv.mode === 'development' ? 'inline-source-map' : '',
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: '/images',
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['autoprefixer', { grid: 'autoplace' }]],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          use: 'pug-loader',
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new CssMinimizerPlugin()],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        template: './src/pug/index.pug',
        hash: true,
      }),
      new HTMLInlineCSSWebpackPlugin(),
    ],
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets/'),
        '@js': path.resolve(__dirname, 'src/js/'),
        '@scss': path.resolve(__dirname, 'src/scss/'),
      },
    },
    devServer: {
      contentBase: outputPath,
      open: true,
    },
  }
}

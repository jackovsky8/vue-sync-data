const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  devtool: 'inline-source-map',

  entry: path.join(__dirname, '/examples/main.js'),

  output: {
    path: path.join(__dirname, '/examples/__build__'),
    filename: 'app.js',
    publicPath: '/examples/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.vue'],
    modules: ['node_modules'],
    alias: {
      vue: 'vue/dist/vue.common.js',
      'vue-sync-data': path.join(__dirname, 'dist/vue-sync-data.esm.js')
    }
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),
    new VueLoaderPlugin()
  ],

  devServer: {
    historyApiFallback: true
  }
}

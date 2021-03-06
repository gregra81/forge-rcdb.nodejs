const HtmlWebpackPlugin = require('html-webpack-plugin')
const debug = require('debug')('app:webpack:config')
const webpack = require('webpack')
const cssnano = require('cssnano')
const config = require('c0nfig')
const path = require('path')

debug('Creating configuration.')

const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : config.compiler_devtool,
  resolve : {
    root       : [
      config.utils_paths.client(),
      path.resolve('./src/client/services'),
      path.resolve('./src/client/components'),
      path.resolve('./src/client/components/Viewing.Extensions')
    ],
    extensions : ['', '.js', '.jsx', '.json']
  },
  module : {}
}

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = config.utils_paths.client('main.js')

webpackConfig.entry = {
  app : [APP_ENTRY].concat(
    `webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`),
  vendor : config.compiler_vendors
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : `[name].[${config.compiler_hash_type}].js`,
  path       : config.utils_paths.dist(),
  publicPath : config.compiler_public_path
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [

  new webpack.ProvidePlugin({
    'window.jQuery': 'jquery',
    jQuery: 'jquery',
    _: 'lodash',
    $: 'jquery'
  }),
  new webpack.DefinePlugin(config.globals),
]

debug('Enable plugins for live development (HMR, NoErrors).')

webpackConfig.plugins.push(
  new HtmlWebpackPlugin({
    threeJS: '/resources/libs/viewer/three.js',
    viewer3D: '/resources/libs/viewer/viewer3D.js',
    viewerCSS: '/resources/libs/viewer/style.css',
    template: config.utils_paths.client('layouts/index.ejs'),
    title: 'Forge | RCDB | DEV',
    filename: 'index.html',
    minify: false,
    inject: 'body'
  }))

webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
)

// ------------------------------------
// No Parse
// ------------------------------------
webpackConfig.module.noParse = /falcor/

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test    : /\.(js|jsx)$/,
  exclude : /node_modules/,
  loader  : 'babel',
  query   : config.compiler_babel
}, {
  test   : /\.json$/,
  loader : 'json'
} ]

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

webpackConfig.module.loaders.push({
  test    : /\.scss$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap'
  ]
})

webpackConfig.module.loaders.push({
  test    : /\.css$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss'
  ]
})

webpackConfig.sassLoader = {
  includepaths : config.utils_paths.client('styles')
}

webpackConfig.postcss = [
  cssnano({
    autoprefixer : {
      add      : true,
      remove   : true,
      browsers : ['last 2 versions']
    },
    discardComments : {
      removeAll : true
    },
    discardUnused : false,
    mergeIdents   : false,
    reduceIdents  : false,
    safe          : true,
    sourcemap     : true
  })
]

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
)
/* eslint-enable */

module.exports = webpackConfig

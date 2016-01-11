'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'src/scripts'),
  entry: './main',

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'app.js'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  plugins: []
};

/*
  Note that you need to make sure the build has completely
  finished before reloading your web page - otherwise,
  only a partial bundle will be served
*/
const path = require('path');

module.exports = {
  // starting point for our frontend JavaScript (place to enter when bundling)
  entry: './client/index.js',

  // where to output our newly bundled file
  output: {
    // the ABSOLUTE path for the directory
    path: path.join(__dirname, '/server', '/static'),
    // the name of the file that will contain our output
    // we could name this whatever we want, but bundle.js is convention
    filename: 'bundle.js'
  },

  mode: 'development',
  devtool: 'source-map',

  // extra modules to incorporate when parsing files
  module: {
    rules: [
      {
        // which files to apply this loader to (end in `js` or `jsx`)
        test: /jsx?$/,

        // which folders to ignore / not apply this to
        exclude: /(node_modules|bower_components)/,

        // which loader to use for this rule-set --> check out .babelrc for our specified rules
        use: ['babel-loader']
      }
    ]
  }
};

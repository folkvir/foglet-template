module.exports = {
  mode: 'development',
  entry: './lib/main.js',
  output: {
    'path': require('path').resolve(process.cwd(), 'bin'),
    'filename': 'template.bundle.js',
    'library': 'template',
    'libraryTarget': 'umd',
    'umdNamedDefine': true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: () => {
          return true
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'env' ]
          }
        }
      }
    ]
  },
  devtool: 'source-map'
}

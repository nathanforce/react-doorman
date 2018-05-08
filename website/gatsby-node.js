const path = require('path')

exports.modifyWebpackConfig = ({ config, stage }) => {
  config.merge({
    resolve: {
      alias: {
        'react-doorman': path.resolve(__dirname, '../'),
      },
    },
  })
  return config
}

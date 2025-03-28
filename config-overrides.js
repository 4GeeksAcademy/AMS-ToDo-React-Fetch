const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    config.output.hashFunction = 'sha256'; 
    return config;
  }
);
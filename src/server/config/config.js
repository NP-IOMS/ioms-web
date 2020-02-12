const _ = require('lodash');
const baseConfiguration = require('./env/all');

// eslint-disable-next-line import/no-dynamic-require
// const environmentSpecificConfiguration = require(`../config/env/${process.env
//   .NAAZ_ENVIRONMENT || 'dev'}`);

module.exports = _.merge(
  {},
  baseConfiguration
  //   environmentSpecificConfiguration
);

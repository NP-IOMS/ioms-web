const path = require('path');

const rootPath = path.normalize(`${__dirname}/../..`);

module.exports = {
  appName: 'ioms-web',
  root: rootPath,
  port: process.env.PORT || 3000,
  accessLog: {
    fileSize: '1m',
    keep: 10,
    compress: true
  },
  isAWSEnvironment: false,
  preferClusterMode: true,
  endpoints: {
    login: 'http://localhost:8090/api/v1/login',
    userRole: 'http://localhost:8090/api/v1/user-role',
    createUser: 'http://localhost:8090/api/v1/users/create',
    editUser: 'http://localhost:8090/api/v1/users/update',
    allUsersByRole: 'http://localhost:8090/api/v1/users/role/',
    allInventory: 'http://localhost:8090/api/v1/inventory',
    createInventory: 'http://localhost:8090/api/v1/inventory/create',
    editInventory: 'http://localhost:8090/api/v1/inventory/update',
    deleteInventory: 'http://localhost:8090/api/v1/inventory/delete/',
    allPendingOrders: 'http://localhost:8090/api/v1/orders/status',
    updateOrder: 'http://localhost:8090/api/v1/order/header/update',
    reportOrder: 'http://localhost:8090/api/v1/reports/order'
  },
  defaultUserPassword: 'password'
};

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
    login: 'http://localhost:8010/api/v1/login',
    userRole: 'http://localhost:8010/api/v1/user-role',
    createUser: 'http://localhost:8010/api/v1/users/create',
    editUser: 'http://localhost:8010/api/v1/users/update',
    allUsersByRole: 'http://localhost:8010/api/v1/users/role/',
    allProduct: 'http://localhost:8010/api/v1/product',
    createProduct: 'http://localhost:8010/api/v1/product/create',
    editProduct: 'http://localhost:8010/api/v1/product/update',
    deleteProduct: 'http://localhost:8010/api/v1/product/delete/',
    allPendingOrders: 'http://localhost:8010/api/v1/orders/status',
    updateOrder: 'http://localhost:8010/api/v1/order/header/update',
    reportOrder: 'http://localhost:8010/api/v1/reports/order',
    allProductCategories: 'http://localhost:8010/api/v1/product/category',
    allProductCategoriesForStatus: 'http://localhost:8010/api/v1/product/categories',
    productCategory: 'http://localhost:8010/api/v1/product/category/',
    createProductCategory: 'http://localhost:8010/api/v1/product/category/create',
    editProductCategory: 'http://localhost:8010/api/v1/product/category/update',
    createFile: 'http://localhost:8010/api/v1/file/create',
    editFile: 'http://localhost:8010/api/v1/file/update'
  },
  defaultUserPassword: 'password'
};

const fetch = require('node-fetch');
const config = require('../config/config.js');
const _ = require('lodash');

const productApiConfig = {
  getAllProductEndPoint: config.endpoints.allProduct,
  allProductCategoriesForStatusEndPoint: config.endpoints.allProductCategoriesForStatus,
  createProductEndPoint: config.endpoints.createProduct,
  editProductEndPoint: config.endpoints.editProduct,
  deleteProductEndPoint: config.endpoints.deleteProduct,
  productCategoryEndPoint: config.endpoints.productCategory,
  createFileEndPoint: config.endpoints.createFile,
  editFileEndPoint: config.endpoints.editFile
};

const ManageProductController = {
  async fetchAllProduct() {
    const url = `${productApiConfig.getAllProductEndPoint}`;
    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let finalProductResult = 'error';
    try {
      const productResult = await fetch(url, OPTIONS);
      finalProductResult = await productResult.json();
      // console.log('finalResult product : ' + JSON.stringify(finalProductResult));
      let allProduct = [];

      for (let tempProduct of finalProductResult) {
        let product = {};
        product.productName = tempProduct.productName;
        product.hsnCode = tempProduct.hsnCode;
        product.productDesc = tempProduct.productDesc;
        product.productPrice = tempProduct.price;
        product.productGstRate = tempProduct.gstRate;
        product.productStatus = tempProduct.status;
        product.productAvlStock = tempProduct.availableStock;
        product.productAddStock = '0';
        product.createdOn = tempProduct.createdOn;
        product.productId = tempProduct.id;
        product.productCategoryId = tempProduct.productCategory.id;
        product.productCategoryName = tempProduct.productCategory.productCategoryName;
        product.productImageName = tempProduct.file.fileName;
        product.imageId = tempProduct.file.id;
        allProduct.push(product);
      }
      return allProduct;
    } catch (error) {
      console.log('error in fetching product : ' + error);
    }
    return '[]';
  },

  async fetchAllProductCategoriesForStatus(status) {
    const url = `${productApiConfig.allProductCategoriesForStatusEndPoint}`;
    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'category-status' : `${status}`
      }
    };

    let finalProductCatResult = 'error';
    try {
      const productCatResult = await fetch(url, OPTIONS);
      finalProductCatResult = await productCatResult.json();
      // console.log('finalProductCatResult product : ' + JSON.stringify(finalProductCatResult));
      let allProductCat = [];

      for (let tempProductCat of finalProductCatResult) {
        let prodCat = {};
        prodCat.id = tempProductCat.id;
        prodCat.productCategoryName = tempProductCat.productCategoryName;
        prodCat.hsnCode = tempProductCat.hsnCode;
        allProductCat.push(prodCat);
      }
      return allProductCat;
    } catch (error) {
      console.log('error in fetching product category: ' + error);
    }
    return '[]';
  },

  async fetchProductCategory(productCategoryId) {
    const url = `${productApiConfig.productCategoryEndPoint}`+productCategoryId;
    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let finalProductCatResult = 'error';
    try {
      const productCatResult = await fetch(url, OPTIONS);
      finalProductCatResult = await productCatResult.json();
      // console.log('fetchProductCategory : ' + JSON.stringify(finalProductCatResult));
      return finalProductCatResult.hsnCode;
    } catch (error) {
      console.log('error in fetching product category: ' + error);
    }
    return '';
  },

  async updateProduct(newProductData, action) {
    let url = '';
    let httpMethodType = 'POST';
    let productId = '';
    let createdOn = '';
    let fileProcessUrl = '';
    let fileId = '';
    const currentTime = new Date().getTime();
    if (action === 'create') {
      createdOn = `${currentTime}`;
      url = `${productApiConfig.createProductEndPoint}`;
      fileProcessUrl = `${productApiConfig.createFileEndPoint}`;
    } else if (action === 'edit') {
      url = `${productApiConfig.editProductEndPoint}`;
      httpMethodType = 'PUT';
      productId = `${newProductData.id}`;
      createdOn = `${newProductData.createdOn}`;
      fileId = `${newProductData.imageId}`;
      fileProcessUrl = `${productApiConfig.editFileEndPoint}`;
    } else {
      url =
        `${productApiConfig.deleteProductEndPoint}` +
        newProductData.productId;
      httpMethodType = 'DELETE';
      productId = `${newProductData.id}`;
      createdOn = `${newProductData.createdOn}`;
    }

    let reqBody = {
      fileId: `${fileId}`,
      fileName: `${newProductData.imageFileName}`,
      fileData: `${newProductData.imageFiles}`
    };

    let OPTIONS = {
      method: httpMethodType,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    };
    let finalResult = 'error';
    try {
      const result = await fetch(fileProcessUrl, OPTIONS);
      finalResult = await result.json();
    } catch (error) {
      console.log(
          `error in creating a file for product : ` + error
      );
    }

    const newFile = finalResult;

    const newStock = parseInt(
        newProductData.availableStock
          ? newProductData.availableStock
          : 0
      );

    reqBody = {
      id: productId,
      productName: `${newProductData.productName}`,
      hsnCode: `${newProductData.hsnCode}`,
      productDesc: `${newProductData.productDesc}`,
      price: `${newProductData.price}`,
      gstRate: `${newProductData.gstRate}`,
      status: `${newProductData.status}`,
      availableStock: newStock,
      createdOn: createdOn,
      modifiedOn: `${currentTime}`,
      productCategory: {
        id: `${newProductData.productCategory.id}`
      },
      file: {
        id: `${newFile.id}`
      }
    };

    OPTIONS = {
      method: httpMethodType,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    };
    finalResult = 'error';
    try {
      const result = await fetch(url, OPTIONS);
      finalResult = await result.json();
      //   console.log('finalResult : ' + JSON.stringify(finalResult));
    } catch (error) {
      console.log(
        `error in creating/editing an product with productName ${newProductData.productName} : ` +
          error
      );
    }
    if (!_.isEmpty(finalResult)) {
      finalResult = 'success';
    }

    return finalResult;
  }
};

module.exports = ManageProductController;

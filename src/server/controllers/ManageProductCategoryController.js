const fetch = require('node-fetch');
const config = require('../config/config.js');
const _ = require('lodash');
const pcApiConfig = {
    allProductCategoriesEndPoint: config.endpoints.allProductCategories,
    createProductCategoryEndPoint: config.endpoints.createProductCategory,
    editProductCategoryEndPoint: config.endpoints.editProductCategory
};

const ManageProductCategoryController = {
    async fetchAllProductCategories() {
        const url = `${pcApiConfig.allProductCategoriesEndPoint}`;
        const OPTIONS = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let finalPCResult = 'error';
        try {
            const pcResult = await fetch(url, OPTIONS);
            finalPCResult = await pcResult.json();
            // console.log('finalResult product categories : ' + JSON.stringify(finalPCResult));
            let allPC = [];

            for (let tempPC of finalPCResult) {
                let productCategory = {};
                productCategory.productCategoryName = tempPC.productCategoryName;
                productCategory.productCategoryDesc = tempPC.productCategoryDesc;
                productCategory.status = tempPC.status;
                if(tempPC.status) {
                    productCategory.productCategoryStatus = 'Active';
                } else {
                    productCategory.productCategoryStatus = 'Inactive';
                }

                productCategory.productCategoryId = tempPC.id;
                productCategory.hsnCode = tempPC.hsnCode;
                productCategory.createdOn = tempPC.createdOn;

                allPC.push(productCategory);
            }
            return allPC;
        } catch (error) {
            console.log('error in fetching productCategory : ' + error);
        }
        return '[]';
    },

    async addNewProductCategory(pcName, pcDescription, pcStatus, pcId, action, hsnCode, createdOn) {

        let url = '';
        let httpMethodType = 'POST';
        const currentTime = new Date().getTime();
        if(action === 'create') {
            pcId = '';
            url = `${pcApiConfig.createProductCategoryEndPoint}`;
            createdOn = `${currentTime}`;
        } else {
            url = `${pcApiConfig.editProductCategoryEndPoint}`;
            httpMethodType = 'PUT';
        }

        const reqBody = {
            id: `${pcId}`,
            productCategoryName: `${pcName}`,
            productCategoryDesc: `${pcDescription}`,
            status: `${pcStatus}`,
            hsnCode: `${hsnCode}`,
            createdOn: `${createdOn}`,
            modifiedOn: `${currentTime}`
        };
        // console.log('reqBody : ' + JSON.stringify(reqBody));

        const OPTIONS = {
            method: httpMethodType,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        };
        let finalResult = 'error';
        try {
            const result = await fetch(url, OPTIONS);
            // console.log('result : ' + JSON.stringify(result));
            finalResult = await result.json();
              // console.log('finalResult : ' + JSON.stringify(finalResult));
        } catch (error) {
            console.log(
                `error in creating a product category ${pcName} : ` + error
            );
        }
        if (!_.isEmpty(finalResult)) {
            finalResult = 'success';
        }

        return finalResult;

    }
};

module.exports = ManageProductCategoryController;

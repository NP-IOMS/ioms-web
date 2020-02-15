const fetch = require('node-fetch');
const config = require('../config/config.js');
const _ = require('lodash');

const inventoryApiConfig = {
    getAllInventoryEndPoint: config.endpoints.allInventory,
    createInventoryEndPoint: config.endpoints.createInventory,
    editInventoryEndPoint: config.endpoints.editInventory,
    deleteInventoryEndPoint: config.endpoints.deleteInventory,
};

const ManageInventoryController = {
    async fetchAllInventory() {
        const url = `${inventoryApiConfig.getAllInventoryEndPoint}`;
        const OPTIONS = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let finalInventoryResult = 'error';
        try {
            const inventoryResult = await fetch(url, OPTIONS);
            finalInventoryResult = await inventoryResult.json();
            // console.log('finalResult inventory : ' + JSON.stringify(finalUserResult));
            let allInventory = [];

            for (let tempInventory of finalInventoryResult) {
                let inventory = {};
                inventory.inventoryName = tempInventory.inventoryName;
                inventory.inventoryDesc = tempInventory.inventoryDesc;
                inventory.inventoryPrice = tempInventory.price;
                inventory.inventoryGstRate = tempInventory.gstRate;
                inventory.inventoryStatus = tempInventory.status;
                inventory.inventoryAvlStock = tempInventory.availableStock;
                inventory.inventoryAddStock = '0';
                inventory.inventoryId = tempInventory.id;
                allInventory.push(inventory);
            }
            return allInventory;
        } catch (error) {
            console.log('error in fetching inventory : ' + error);
        }
        return '[]';
    },

    async updateInventory(newInventoryData, action) {
        let url = '';
        let httpMethodType = 'POST';
        let inventoryId = '';
        console.log("newInventoryData  :: "+JSON.stringify(newInventoryData));
        console.log("action  :: "+action);
        if (action === 'create') {
            url = `${inventoryApiConfig.createInventoryEndPoint}`;
        } else if (action === 'edit'){
            url = `${inventoryApiConfig.editInventoryEndPoint}`;
            httpMethodType = 'PUT';
            inventoryId = `${newInventoryData.inventoryId}`;
        } else {
            url = `${inventoryApiConfig.deleteInventoryEndPoint}` + newInventoryData.inventoryId;
            httpMethodType = 'DELETE';
            inventoryId = `${newInventoryData.inventoryId}`;
        }

        const currentTime = new Date().getTime();

        const newStock = parseInt(newInventoryData.inventoryAvlStock ? newInventoryData.inventoryAvlStock : 0)
            + parseInt(newInventoryData.inventoryAddStock ? newInventoryData.inventoryAddStock : 0);

        const reqBody = {
            id: inventoryId,
            inventoryName: `${newInventoryData.inventoryName}`,
            inventoryDesc: `${newInventoryData.inventoryDesc}`,
            price: `${newInventoryData.inventoryPrice}`,
            gstRate: `${newInventoryData.inventoryGstRate}`,
            status: `${newInventoryData.inventoryStatus}`,
            availableStock: newStock,
            createdOn: `${currentTime}`,
        };
        console.log("reqBody  :: "+JSON.stringify(reqBody));

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
            finalResult = await result.json();
            //   console.log('finalResult : ' + JSON.stringify(finalResult));
        } catch (error) {
            console.log(
                `error in creating/editing an inventory with inventoryName ${newInventoryData.inventoryName} : ` + error
            );
        }
        if (!_.isEmpty(finalResult)) {
            finalResult = 'success';
        }

        return finalResult;
    },
}

module.exports = ManageInventoryController;

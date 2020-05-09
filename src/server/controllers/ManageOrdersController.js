const fetch = require('node-fetch');
const config = require('../config/config.js');
const _ = require('lodash');

const ordersApiConfig = {
    allPendingOrdersEndPoint: config.endpoints.allPendingOrders,
    updateOrderEndPoint: config.endpoints.updateOrder
};

const ManageOrdersController = {
    async fetchAllOrders() {

        const url = `${ordersApiConfig.allPendingOrdersEndPoint}`;

        const OPTIONS_RAISED = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'orderStatus' : 'RAISED'
            }
        };

        const OPTIONS_DISPATCHED = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'orderStatus' : 'DISPATCHED'
            }
        };

        try {
            let ordersResult = await fetch(url, OPTIONS_RAISED);
            let finalOrdersResult = await ordersResult.json();
            // console.log('pendingOrders orders : ' + JSON.stringify(finalOrdersResult));
            let allOrders = {
                'pendingOrders': {},
                'dispatchedOrders': {}
            };
            allOrders.pendingOrders = await this.generateOrdersJson(finalOrdersResult);

            ordersResult = await fetch(url, OPTIONS_DISPATCHED);
            finalOrdersResult = await ordersResult.json();
            // console.log('dispatchedOrders orders : ' + JSON.stringify(finalOrdersResult));
            allOrders.dispatchedOrders = await this.generateOrdersJson(finalOrdersResult);

            return allOrders;
        } catch (error) {
            console.log('error in fetching orders : ' + error);
        }
        return '[]';
    },

    async generateOrdersJson(finalPendingOrdersResult) {
        let pendingOrders = [];

        for (let tempOrder of finalPendingOrdersResult) {
            let order = {};

            order.orderNumber = tempOrder.id;
            order.orderRaisedBy = tempOrder.createdBy.userAccountName;
            order.orderPrice = tempOrder.orderPrice;
            order.orderGstAmount = tempOrder.orderGstAmount;
            order.orderCustomerName = tempOrder.customer.userAccountName;
            order.orderStatus = tempOrder.status;

            let ordersDetails = [];
            for (let tempOrdersDetail of tempOrder.ordersDetails) {
                let orderDetail = {};
                orderDetail.productName = tempOrdersDetail.product.productName;
                orderDetail.productPrice = tempOrdersDetail.productPrice;
                orderDetail.gstRate = tempOrdersDetail.gstRate;
                orderDetail.productQty = tempOrdersDetail.productQuantity;
                ordersDetails.push(orderDetail);
            }
            order.ordersDetails = ordersDetails;

            pendingOrders.push(order);
        }

        return pendingOrders;
    },

    async updateOrder(orderData) {
        const url = `${ordersApiConfig.updateOrderEndPoint}`;

        const currentTime = new Date().getTime();

        const reqBody = {
            id: orderData.orderNumber,
            status: 'DISPATCHED',
            approvedOn: `${currentTime}`,
            dispatchedOn: `${currentTime}`,
        };

        // console.log("reqBody  :: "+JSON.stringify(reqBody));

        const OPTIONS = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        };

        let updateOrderResult = 'error';
        try {
            const ordersResult = await fetch(url, OPTIONS);
            updateOrderResult = await ordersResult.json();
            // console.log('finalResult orders : ' + JSON.stringify(updateOrderResult));
        } catch (error) {
            console.log('error in updating order : ' + error);
        }
        if (!_.isEmpty(updateOrderResult)) {
            updateOrderResult = 'success';
        }

        return updateOrderResult;
    }
}

module.exports = ManageOrdersController;

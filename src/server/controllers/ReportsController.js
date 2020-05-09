const fetch = require('node-fetch');
const config = require('../config/config.js');

const reportsApiConfig = {
  reportOrderEndPoint: config.endpoints.reportOrder
};

const ReportsController = {
  async fetchOrders(status, startDate, endDate) {
    const url = `${reportsApiConfig.reportOrderEndPoint}`;

    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        orderStatus: `${status}`,
        fromDate: `${startDate}`,
        endDate: `${endDate}`
      }
    };

    try {
      let reportResult = await fetch(url, OPTIONS);
      let finalReportResult = await reportResult.json();
      // console.log('finalReportResult : ' + JSON.stringify(finalReportResult));
      return finalReportResult;
    } catch (error) {
      console.log('error in fetching orders report : ' + error);
    }
    return '[]';
  }
};

module.exports = ReportsController;

import React, { Component } from 'react';
import MaterialTable from 'material-table';
import '../../styles/ManageOrders.scss';
import ManageOrdersController from '../../server/controllers/ManageOrdersController';
import Auth from "../../Auth";

export default class ManageOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderHeader: [
        {
          title: 'Order Number',
          field: 'orderNumber',
          headerStyle: { width: '10%', textAlign: 'left' },
          cellStyle: { width: '10%', textAlign: 'left' }
        },
        {
          title: 'Order Raised By',
          field: 'orderRaisedBy',
          headerStyle: { width: '10%', textAlign: 'left' },
          cellStyle: { width: '10%', textAlign: 'left' }
        },
        {
          title: 'Order Price (INR)',
          field: 'orderPrice',
          type: 'numeric',
          headerStyle: { width: '10%', textAlign: 'center' },
          cellStyle: { width: '10%', textAlign: 'center' }
        },
        {
          title: 'Order GST Amount',
          field: 'orderGstAmount',
          headerStyle: { width: '10%', textAlign: 'center' },
          cellStyle: { width: '10%', textAlign: 'center' }
        },
        {
          title: 'Customer Name',
          field: 'orderCustomerName',
          headerStyle: { width: '10%', textAlign: 'left' },
          cellStyle: { width: '10%', textAlign: 'left' }
        },
        {
          title: 'Order Status',
          field: 'orderStatus',
          headerStyle: { width: '10%', textAlign: 'left' },
          cellStyle: { width: '10%', textAlign: 'left' }
        }
      ],
      pendingOrderHeaderRowData: [],
      dispatchedOrderHeaderRowData: [],
      ordersDetailsHeader: [
        {
          title: 'Inventory Name',
          field: 'inventoryName',
          headerStyle: { width: '25%', textAlign: 'left' },
          cellStyle: { width: '25%', textAlign: 'left' }
        },
        {
          title: 'Inventory Price',
          field: 'inventoryPrice',
          type: 'numeric',
          headerStyle: { width: '25%', textAlign: 'center' },
          cellStyle: { width: '25%', textAlign: 'center' }
        },
        {
          title: 'GST Rate',
          field: 'gstRate',
          type: 'numeric',
          headerStyle: { width: '25%', textAlign: 'center' },
          cellStyle: { width: '25%', textAlign: 'center' }
        },
        {
          title: 'Inventory Quantity',
          field: 'inventoryQty',
          type: 'numeric',
          headerStyle: { width: '25%', textAlign: 'center' },
          cellStyle: { width: '25%', textAlign: 'center' }
        }
      ]
    };
  }

  async componentDidMount() {
    if(Auth.isAuthenticated()) {
      this.fetchAllOrders();
    } else {
      this.props.history.push('/');
    }
  }

  async fetchAllOrders() {
    const allOrders = await ManageOrdersController.fetchAllOrders();
    this.setState({ pendingOrderHeaderRowData: allOrders.pendingOrders });
    this.setState({ dispatchedOrderHeaderRowData: allOrders.dispatchedOrders });
  }

  orderUpdate = async (orderData, action) => {
    // console.log(JSON.stringify(orderData));

    let result = await ManageOrdersController.updateOrder(orderData);

    let alertMsg = 'Order updated successfully!!';

    if (result === 'success') {
      this.fetchAllPendingOrders();
      alert(alertMsg);
    } else {
      alert(
        'Internal error while adding a new inventory, please contact support!!'
      );
    }
  };

  render() {
    return (
      <div className='ordersContainer'>
        <div className='pendingOrders'>
          <MaterialTable
            title='Pending Orders'
            columns={this.state.orderHeader}
            data={this.state.pendingOrderHeaderRowData}
            detailPanel={rowData => {
              return (
                <div className='orderDetails'>
                  <MaterialTable
                    columns={this.state.ordersDetailsHeader}
                    data={rowData.ordersDetails}
                    pagination={false}
                    minRows={0}
                  />
                </div>
              );
            }}
            options={{
              exportButton: true
            }}
            actions={[
              {
                icon: 'update',
                tooltip: 'Update Order',
                onClick: (event, rowData) => this.orderUpdate(rowData, 'save')
              }
            ]}
            emptyRowsWhenPaging={false}
          />
        </div>
        <div className='dispatchedOrders'>
          <MaterialTable
            title='Dispatched Orders'
            columns={this.state.orderHeader}
            data={this.state.dispatchedOrderHeaderRowData}
            detailPanel={rowData => {
              return (
                <div className='orderDetails'>
                  <MaterialTable
                    columns={this.state.ordersDetailsHeader}
                    data={rowData.ordersDetails}
                    pagination={false}
                    emptyRowsWhenPaging={false}
                    rowsPerPage
                  />
                </div>
              );
            }}
            options={{
              exportButton: true
            }}
            emptyRowsWhenPaging={false}
          />
        </div>
      </div>
    );
  }
}

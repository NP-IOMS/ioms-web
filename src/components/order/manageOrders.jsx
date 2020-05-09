import React, { Component } from 'react';
import MaterialTable from 'material-table';
import '../../styles/ManageOrders.scss';
import ManageOrdersController from '../../server/controllers/ManageOrdersController';
import Auth from "../../Auth";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

export default class ManageOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogMessage: 'Order updated successfully!!',
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
          title: 'Product Name',
          field: 'productName',
          headerStyle: { width: '25%', textAlign: 'left' },
          cellStyle: { width: '25%', textAlign: 'left' }
        },
        {
          title: 'Product Price',
          field: 'productPrice',
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
          title: 'Product Quantity',
          field: 'productQty',
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
    this.setState({
      pendingOrderHeaderRowData: allOrders.pendingOrders,
      dispatchedOrderHeaderRowData: allOrders.dispatchedOrders
    });
  }

  handleDialogClose = () => {
    this.setState({openDialog: false});
  };

  orderUpdate = async (orderData, action) => {
    // console.log(JSON.stringify(orderData));

    let result = await ManageOrdersController.updateOrder(orderData);

    if (result === 'success') {
      this.fetchAllOrders();
      this.setState({openDialog: true});
    } else {
      this.setState({dialogMessage: 'Internal error while adding a User, please contact support!!'});
    }
  };

  render() {
    return (
      <div className='ordersContainer'>
        <Dialog
            open={this.state.openDialog}
            onClose={this.handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

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
                tooltip: 'Dispatch Order',
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

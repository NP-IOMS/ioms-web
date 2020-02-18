import React, { Component } from 'react';
import MaterialTable from 'material-table';
import '../../styles/ManageInventory.scss';
import ManageInventoryController from '../../server/controllers/ManageInventoryController';
import Auth from "../../Auth";

export default class ManageInventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventoryHeader: [
        {
          title: 'Inventory Name',
          field: 'inventoryName',
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' }
        },
        {
          title: 'Inventory Description',
          field: 'inventoryDesc',
          cellStyle: { width: '30%', textAlign: 'left' },
          headerStyle: { width: '30%', textAlign: 'left' }
        },
        {
          title: 'Price (INR)',
          field: 'inventoryPrice',
          type: 'numeric',
          cellStyle: { width: '10%', textAlign: 'center' },
          headerStyle: { width: '10%', textAlign: 'center' }
        },
        {
          title: 'GST Rate',
          field: 'inventoryGstRate',
          type: 'numeric',
          cellStyle: { width: '10%', textAlign: 'center' },
          headerStyle: { width: '10%', textAlign: 'center' }
        },
        {
          title: 'Status',
          field: 'inventoryStatus',
          lookup: { true: 'Active', false: 'Inactive' },
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' }
        },
        {
          title: 'Available Stock',
          field: 'inventoryAvlStock',
          type: 'numeric',
          cellStyle: { width: '10%', textAlign: 'center' },
          headerStyle: { width: '10%', textAlign: 'center' }
        },
        {
          title: 'Add Stock',
          field: 'inventoryAddStock',
          type: 'numeric',
          cellStyle: { width: '10%', textAlign: 'center' },
          headerStyle: { width: '10%', textAlign: 'center' }
        }
      ],
      inventoryRowData: []
    };
  }

  async componentDidMount() {
    if(Auth.isAuthenticated()) {
      this.fetchAllInventory();
    } else {
      this.props.history.push('/');
    }
  }

  async fetchAllInventory() {
    const allInventory = await ManageInventoryController.fetchAllInventory();
    this.setState({ inventoryRowData: allInventory });
  }

  inventoryUpdate = async (inventoryData, action) => {
    const result = await ManageInventoryController.updateInventory(
      inventoryData,
      action
    );
    let alertMsg = 'New inventory added successfully!!';
    if (action === 'edit') {
      alertMsg = 'Inventory updated successfully!!';
    } else if (action === 'delete') {
      alertMsg = 'Inventory deleted successfully!!';
    }

    if (result === 'success') {
      this.fetchAllInventory();
      alert(alertMsg);
    } else {
      alert(
        'Internal error while adding a new inventory, please contact support!!'
      );
    }
  };

  render() {
    return (
      <MaterialTable
        title='Manage Inventory'
        columns={this.state.inventoryHeader}
        data={this.state.inventoryRowData}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                this.inventoryUpdate(newData, 'create');
                resolve();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                if (oldData) {
                  this.inventoryUpdate(newData, 'edit');
                }
                resolve();
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                this.inventoryUpdate(oldData, 'delete');
                resolve();
              }, 600);
            })
        }}
        options={{
          exportButton: true
        }}
      />
    );
  }
}

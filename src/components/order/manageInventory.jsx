import React, { Component } from 'react';
import MaterialTable from 'material-table';
import '../../styles/ManageInventory.scss';
import ManageInventoryController from '../../server/controllers/ManageInventoryController';

export default class ManageInventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventoryHeader: [
        { title: 'Inventory Name', field: 'inventoryName' },
        { title: 'Inventory Description', field: 'inventoryDesc' },
        { title: 'Price (INR)', field: 'inventoryPrice', type: 'numeric' },
        { title: 'GST Rate', field: 'inventoryGstRate', type: 'numeric' },
        {
          title: 'Status',
          field: 'inventoryStatus',
          lookup: { 'true': 'Active', 'false': 'Inactive' }
        },
        {
          title: 'Available Stock',
          field: 'inventoryAvlStock',
          type: 'numeric'
        },
        { title: 'Add Stock', field: 'inventoryAddStock', type: 'numeric' }
      ],
      inventoryRowData: []
    };
  }

  async componentDidMount() {
    this.fetchAllInventory();
  }

  async fetchAllInventory() {
    const allInventory = await ManageInventoryController.fetchAllInventory();
    this.setState({ inventoryRowData: allInventory });
  }

  inventoryUpdate = async (inventoryData, action) => {
    console.log(JSON.stringify(inventoryData));
    const result = await ManageInventoryController.updateInventory(inventoryData, action);
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
      alert('Internal error while adding a new inventory, please contact support!!');
    }
  }

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
              }, 600);})
          ,
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
      />
    );
  }
}

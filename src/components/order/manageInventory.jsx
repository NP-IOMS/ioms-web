import React, { Component } from 'react';
import MaterialTable from 'material-table';
import '../../styles/ManageInventory.scss';
import ManageInventoryController from '../../server/controllers/ManageInventoryController';
import Auth from "../../Auth";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

export default class ManageInventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogMessage: 'New inventory added successfully!!',
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

  handleDialogClose = () => {
    this.setState({openDialog: false});
  };

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

    if (action === 'edit') {
      this.setState({dialogMessage: 'Inventory updated successfully!!'});
    } else if (action === 'delete') {
      this.setState({dialogMessage: 'Inventory deleted successfully!!'});
    }

    if (result === 'success') {
      this.setState({openDialog: true});
      this.fetchAllInventory();
    } else {
      this.setState({dialogMessage: 'Internal error while adding a new inventory, please contact support!!'});
    }
  };

  render() {
    return (
        <div>
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
        </div>
    );
  }
}

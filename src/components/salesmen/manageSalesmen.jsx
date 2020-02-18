import React, { Component } from 'react';
import {
  Typography,
  TextField,
  Button,
  InputAdornment
} from '@material-ui/core';
import SearchSharp from '@material-ui/icons/SearchSharp';
import '../../styles/ManageSalesman.scss';
import ManageUserController from '../../server/controllers/ManageUserController';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Auth from "../../Auth";

export default class ManageSalesmen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: AllCommunityModules,
      smId: '',
      smFullName: '',
      smMobileNumber: '',
      smMonthlyTarget: '',
      smAddress: '',
      smUserRoleId: '',
      createBtnAction: 'create',
      createBtnText: 'Create a Salesman',
      errors: [],
      user: {},
      salesmenColumnsDef: [
        {
          headerName: 'Full Name',
          field: 'userAccountName',
          sortable: true,
          checkboxSelection: true,
          width: 200,
          suppressSizeToFit: true
        },
        {
          headerName: 'Mobile Number',
          field: 'userMobileNumber',
          sortable: true,
          width: 130
        },
        {
          headerName: 'Monthly Target',
          field: 'userMonthlyTarget',
          sortable: true,
          width: 130
        },
        {
          headerName: 'Address',
          field: 'userAddress',
          sortable: true,
          width: 300
        }
      ],
      rowSelection: 'single',
      defaultColDef: { resizable: true },
      salesmenRowData: null
    };
  }

  async componentDidMount() {
    if(Auth.isAuthenticated()) {
      if (this.state.smUserRoleId === '') {
        const userRoleId = await ManageUserController.fetchUserRoles('SALESMAN');
        if (userRoleId === 'error') {
        } else {
          this.setState({
            smUserRoleId: userRoleId
          });
        }
      }
      this.fetchAllSalesmen();
    } else {
      this.props.history.push('/');
    }
  }

  async fetchAllSalesmen() {
    const allUsers = await ManageUserController.fetchAllUsersByRole(
      this.state.smUserRoleId
    );
    this.setState({ salesmenRowData: allUsers });
  }

  handleChange = elem => {
    this.setState({
      [elem.target.id]: elem.target.value
    });
    this.clearValidationError(elem.target.id);
  };

  showValidationError = (elem, msg) => {
    this.setState(prevState => ({
      errors: [
        ...prevState.errors,
        {
          elem,
          msg
        }
      ]
    }));
  };

  clearValidationError = elem => {
    this.setState(prevState => {
      let newErrors = [];
      for (let err of prevState.errors) {
        if (elem !== err.elem) {
          newErrors.push(err);
        }
      }
      return { errors: newErrors };
    });
  };

  clearAllValidationError() {
    this.setState(prevState => {
      let newErrors = [];
      for (let err of prevState.errors) {
        newErrors.pop();
      }
      return { errors: newErrors };
    });
  }

  handleAddSalesman = async elem => {
    if (this.validateAddSalesman()) {
      const result = await ManageUserController.addNewUser(
        this.state.smMobileNumber,
        this.state.smFullName,
        this.state.smUserRoleId,
        this.state.smAddress,
        this.state.smMobileNumber,
        this.state.smMonthlyTarget,
        this.state.smId,
        this.state.createBtnAction
      );

      if (result === 'success') {
        alert('Salesman added successfully!!');
        this.fetchAllSalesmen();
        this.handleResetSalesman();
      } else {
        alert(
          'Internal error while adding a Salesman, please contact support!!'
        );
      }
    } else {
      return false;
    }
  };

  validateAddSalesman() {
    let valid = true;
    if (this.state.smFullName === '') {
      this.showValidationError('smFullName', 'Full Name can not be empty!');
      valid = false;
    }

    if (this.state.smMobileNumber === '') {
      this.showValidationError(
        'smMobileNumber',
        'Mobile Number can not be empty!'
      );
      valid = false;
    } else if (
      isNaN(this.state.smMobileNumber) ||
      this.state.smMobileNumber.toString().length !== 10
    ) {
      this.showValidationError('smMobileNumber', 'Invalid Mobile Number!');
      valid = false;
    } else {
      for (let rowData of this.state.salesmenRowData) {
        if (
          this.state.smId.toString() !== rowData.userId.toString() &&
          this.state.smMobileNumber.toString() ===
            rowData.userMobileNumber.toString()
        ) {
          this.showValidationError(
            'smMobileNumber',
            'Mobile Number already exists!'
          );
          valid = false;
          break;
        }
      }
    }

    if (this.state.smMonthlyTarget === '') {
      this.showValidationError(
        'smMonthlyTarget',
        'Monthly Target can not be empty!'
      );
      valid = false;
    } else if (isNaN(this.state.smMonthlyTarget)) {
      this.showValidationError(
        'smMonthlyTarget',
        'Monthly Target can only be a number!'
      );
      valid = false;
    }
    if (this.state.smAddress === '') {
      this.showValidationError('smAddress', 'Address can not be empty!');
      valid = false;
    }

    return valid;
  }

  handleResetSalesman = elem => {
    this.setState({
      smMobileNumber: '',
      smFullName: '',
      smAddress: '',
      smMonthlyTarget: '',
      createBtnText: 'Create a Salesman',
      createBtnAction: 'create'
    });

    this.clearAllValidationError();
  };

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
  }

  onSelectionChanged() {
    let selectedRows = this.gridApi.getSelectedRows();

    this.setState({
      smMobileNumber: selectedRows[0].userMobileNumber,
      smFullName: selectedRows[0].userAccountName,
      smAddress: selectedRows[0].userAddress,
      smMonthlyTarget: selectedRows[0].userMonthlyTarget,
      createBtnText: 'Edit Salesman',
      createBtnAction: 'edit',
      smId: selectedRows[0].userId
    });

    this.clearAllValidationError();
  }

  render() {
    let smFullNameErrMsg = null;
    let smMobileNumberErrMsg = null;
    let smMonthlyTargetErrMsg = null;
    let smAddressErrMsg = null;

    for (let err of this.state.errors) {
      if (err.elem === 'smFullName') {
        smFullNameErrMsg = err.msg;
      }
      if (err.elem === 'smMobileNumber') {
        smMobileNumberErrMsg = err.msg;
      }
      if (err.elem === 'smMonthlyTarget') {
        smMonthlyTargetErrMsg = err.msg;
      }
      if (err.elem === 'smAddress') {
        smAddressErrMsg = err.msg;
      }
    }

    return (
      <div className='container'>
        <div className='show-salesman-container'>
          <div className='create-salesman-header'>
            <Typography variant='h6' component='h2'>
              All Salesmen Details
            </Typography>
          </div>
          <div className='quickFilter'>
            <TextField
              id='quickFilter'
              placeholder='Quick Filter'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <SearchSharp />
                  </InputAdornment>
                )
              }}
              onInput={this.onQuickFilterChanged.bind(this)}
            />
          </div>
          <div style={{ width: '100%', float: 'left' }}>
            <div className='ag-theme-balham salesmanDetailsTable'>
              <AgGridReact
                columnDefs={this.state.salesmenColumnsDef}
                rowData={this.state.salesmenRowData}
                rowSelection={this.state.rowSelection}
                modules={this.state.modules}
                defaultColDef={this.state.defaultColDef}
                onGridReady={this.onGridReady}
                onRowSelected={this.onSelectionChanged.bind(this)}
              />
            </div>
          </div>
        </div>

        <div className='create-salesman-container'>
          <div className='create-salesman-header'>
            <Typography variant='h6' component='h2'>
              Add a new Salesman
            </Typography>
          </div>
          <div style={{ width: '100%', float: 'left' }}>
            <TextField
              id='smFullName'
              label='Full Name'
              variant='outlined'
              fullWidth
              className='salesman-textfield'
              margin='normal'
              required={true}
              onChange={this.handleChange}
              value={this.state.smFullName}
            />
            <small className='danger-error'>
              {smFullNameErrMsg ? smFullNameErrMsg : ''}
            </small>

            <TextField
              id='smMobileNumber'
              label='Mobile Number'
              variant='outlined'
              fullWidth
              required={true}
              className='salesman-textfield'
              margin='normal'
              onChange={this.handleChange}
              value={this.state.smMobileNumber}
            />
            <small className='danger-error'>
              {smMobileNumberErrMsg ? smMobileNumberErrMsg : ''}
            </small>

            <TextField
              id='smMonthlyTarget'
              label='Monthly Target'
              variant='outlined'
              fullWidth
              required={true}
              className='salesman-textfield'
              margin='normal'
              onChange={this.handleChange}
              value={this.state.smMonthlyTarget}
            />
            <small className='danger-error'>
              {smMonthlyTargetErrMsg ? smMonthlyTargetErrMsg : ''}
            </small>

            <TextField
              id='smAddress'
              label='Address'
              placeholder='Address'
              multiline
              rows='4'
              fullWidth
              variant='outlined'
              className='salesman-textarea'
              onChange={this.handleChange}
              required={true}
              value={this.state.smAddress}
            />
            <small className='danger-error'>
              {smAddressErrMsg ? smAddressErrMsg : ''}
            </small>
            <br></br>
            <br></br>
            <Button
              id='createBtn'
              variant='contained'
              color='primary'
              className='btn-primary-salesman'
              onClick={this.handleAddSalesman}
            >
              {this.state.createBtnText}
            </Button>
            <Button
              id='resetBtn'
              variant='contained'
              color='primary'
              className='btn-primary-salesman'
              onClick={this.handleResetSalesman}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

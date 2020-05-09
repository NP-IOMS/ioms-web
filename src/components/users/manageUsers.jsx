import React, { Component } from 'react';
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import SearchSharp from '@material-ui/icons/SearchSharp';
import '../../styles/ManageUsers.scss';
import ManageUserController from '../../server/controllers/ManageUserController';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { DropzoneDialog } from 'material-ui-dropzone';
import Auth from '../../Auth';
import MaterialTable from 'material-table';

export default class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      dialogMessage: '',
      modules: AllCommunityModules,
      smId: '',
      smFullName: '',
      smMobileNumber: '',
      smMonthlyTarget: '',
      smAddress: '',
      smUserRoleId: '',
      createBtnAction: 'create',
      createBtnText: 'Create a User',
      errors: [],
      user: {},
      openImage: false,
      smImageFiles: [],
      imageFileName: 'no image selected',
      userImageId: 0,
      imageId: '',
      showImageWithLink: 'hide-display',
      showImageWithoutLink: 'show-display',
      usersColumnsDef: [
        {
          title: 'Full Name',
          field: 'userAccountName',
          cellStyle: { width: '25%', textAlign: 'left' },
          headerStyle: { width: '25%', textAlign: 'left' },
        },
        {
          title: 'Mobile Number',
          field: 'userMobileNumber',
          type: 'numeric',
          cellStyle: { width: '20%', textAlign: 'left' },
          headerStyle: { width: '20%', textAlign: 'left' },
        },
        {
          title: 'Monthly Target',
          field: 'userMonthlyTarget',
          type: 'numeric',
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' },
        },
        {
          title: 'Address',
          field: 'userAddress',
          cellStyle: { width: '30%', textAlign: 'left' },
          headerStyle: { width: '30%', textAlign: 'left' },
        },
        {
          title: 'Image',
          field: 'userImage',
          cellStyle: { width: '15%', textAlign: 'left' },
          headerStyle: { width: '15%', textAlign: 'left' },
          // onClick
        },
      ],
      // rowSelection: 'single',
      // defaultColDef: { resizable: true },
      usersRowData: [],
    };
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  downloadImage = () => {
    const imageId = this.state.imageId;
    const imageUrl = 'http://localhost:8010/api/v1/file/blob/' + imageId;
    let base64ImageData = null;
    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
      },
    };
    fetch(imageUrl, OPTIONS)
      .then((response) => response.text())
      .then((response) => {
        base64ImageData = response;
        let imageType = this.state.imageFileName.split('.')[1];
        if (imageType === 'jpg') {
          imageType = 'jpeg';
        }
        const contentType = `image/${imageType}`;
        const byteCharacters = atob(
          base64ImageData.substr(`data:${contentType};base64,`.length)
        );
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }
        const blobImage = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blobImage);

        window.open(blobUrl, '_blank');
      });
  };

  async componentDidMount() {
    if (Auth.isAuthenticated()) {
      if (this.state.smUserRoleId === '') {
        const userRoleId = await ManageUserController.fetchUserRoles(
          'SALESMAN'
        );
        if (userRoleId === 'error') {
        } else {
          this.setState({
            smUserRoleId: userRoleId,
          });
        }
      }
      this.fetchAllUsers();
    } else {
      this.props.history.push('/');
    }
  }

  async fetchAllUsers() {
    const allUsers = await ManageUserController.fetchAllUsersByRole(
      this.state.smUserRoleId
    );
    this.setState({ usersRowData: allUsers });
  }

  handleChange = (elem) => {
    this.setState({
      [elem.target.id]: elem.target.value,
    });
    this.clearValidationError(elem.target.id);
  };

  showValidationError = (elem, msg) => {
    this.setState((prevState) => ({
      errors: [
        ...prevState.errors,
        {
          elem,
          msg,
        },
      ],
    }));
  };

  clearValidationError = (elem) => {
    this.setState((prevState) => {
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
    this.setState((prevState) => {
      let newErrors = [];
      for (let err of prevState.errors) {
        newErrors.pop();
      }
      return { errors: newErrors };
    });
  }

  handleAddUsers = async (elem) => {
    if (this.validateAddUsers()) {
      const result = await ManageUserController.addNewUser(
        this.state.smMobileNumber,
        this.state.smFullName,
        this.state.smUserRoleId,
        this.state.smAddress,
        this.state.smMobileNumber,
        this.state.smMonthlyTarget,
        this.state.smId,
        this.state.createBtnAction,
        this.state.smImageFiles,
        this.state.imageFileName,
        this.state.imageId
      );
      // console.log('result: ', result);
      if (result === 'success') {
        if (this.state.createBtnAction === 'create') {
          this.setState({ dialogMessage: 'User added successfully!!' });
        } else {
          this.setState({ dialogMessage: 'User updated successfully!!' });
        }

        this.fetchAllUsers();
        this.handleResetUsers();
      } else {
        this.setState({
          dialogMessage:
            'Internal error while adding a User, please contact support!!',
        });
      }

      this.setState({ openDialog: true });
    } else {
      return false;
    }
  };

  validateAddUsers() {
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
      for (let rowData of this.state.usersRowData) {
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

    if (this.state.smImageFiles.length === 0) {
      this.showValidationError('smImageFiles', 'Select some image!');
      valid = false;
    }

    return valid;
  }

  handleResetUsers = (elem) => {
    this.setState({
      smMobileNumber: '',
      smFullName: '',
      smAddress: '',
      smMonthlyTarget: '',
      createBtnText: 'Create a User',
      createBtnAction: 'create',
      showImageWithLink: 'hide-display',
      showImageWithoutLink: 'show-display',
    });

    this.clearAllValidationError();
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
  }

  onSelectionChanged(selectedRows) {
    this.setState({
      smMobileNumber: selectedRows.userMobileNumber,
      smFullName: selectedRows.userAccountName,
      smAddress: selectedRows.userAddress,
      smMonthlyTarget: selectedRows.userMonthlyTarget,
      imageFileName: selectedRows.userImage,
      createBtnText: 'Edit User',
      createBtnAction: 'edit',
      smId: selectedRows.userId,
      userImageId: selectedRows.userImageId,
      imageId: selectedRows.userImageId,
    });

    this.clearAllValidationError();

    this.setState({
      showImageWithLink: 'show-display',
      showImageWithoutLink: 'hide-display',
    });
  }

  handleClose() {
    this.setState({
      openImage: false,
      showImageWithLink: 'hide-display',
      showImageWithoutLink: 'show-display',
    });
  }

  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = (file) => {
      this.setState({
        smImageFiles: file.target.result,
        imageFileName: files[0].name,
        openImage: false,
      });
    };
  }

  handleOpen() {
    this.setState({
      openImage: true,
    });
    this.clearValidationError('smImageFiles');
  }

  render() {
    let smFullNameErrMsg = null;
    let smMobileNumberErrMsg = null;
    let smMonthlyTargetErrMsg = null;
    let smAddressErrMsg = null;
    let smImageFileErrMsg = null;

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
      if (err.elem === 'smImageFiles') {
        smImageFileErrMsg = err.msg;
      }
    }

    return (
      <div className='container'>
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleDialogClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{''}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {this.state.dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color='primary' autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <div className='show-users-container'>
          <div className='create-users-header'>
            <Typography variant='h6' component='h2'>
              All Users Details
            </Typography>
          </div>
          <div className='quick-filter'>
            <TextField
              id='quickFilter'
              placeholder='Quick Filter'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='start'>
                    <SearchSharp />
                  </InputAdornment>
                ),
              }}
              onInput={this.onQuickFilterChanged.bind(this)}
            />
          </div>
          <div className='users-grid'>
            <div>
              <MaterialTable
                title='All Product Details'
                columns={this.state.usersColumnsDef}
                data={this.state.usersRowData}
                options={{
                  columnsButton: true,
                  exportButton: true,
                  exportAllData: true,
                }}
                actions={[
                  {
                    icon: 'edit',
                    tooltip: 'Edit Product',
                    onClick: (event, rowData) =>
                      this.onSelectionChanged(rowData),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className='create-users-container'>
          <div className='create-users-header'>
            <Typography variant='h6' component='h2'>
              Add a new User
            </Typography>
          </div>
          <div style={{ width: '100%', float: 'left' }}>
            <TextField
              id='smFullName'
              label='Full Name'
              variant='outlined'
              fullWidth
              className='users-textfield'
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
              className='users-textfield'
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
              className='users-textfield'
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
              className='users-textarea'
              onChange={this.handleChange}
              required={true}
              value={this.state.smAddress}
            />
            <small className='danger-error'>
              {smAddressErrMsg ? smAddressErrMsg : ''}
            </small>
            <br></br>

            <div className='image-div-container'>
              <div className='image-div-sub-container'>
                <Button
                  id='imageBtn'
                  variant='contained'
                  color='secondary'
                  className='btn-image-upload'
                  onClick={this.handleOpen.bind(this)}
                >
                  Upload Photo ID
                </Button>
              </div>

              <div className='image-div-text'>
                <div className={this.state.showImageWithoutLink}>
                  <Typography variant='h6' component='h4'>
                    {this.state.imageFileName}
                  </Typography>
                </div>
              </div>

              <div className='image-div-text'>
                <div className={this.state.showImageWithLink}>
                  <a href='javascript:void(0);' onClick={this.downloadImage}>
                    <Typography variant='h6' component='h4'>
                      {this.state.imageFileName}
                    </Typography>
                  </a>
                </div>
              </div>

              <DropzoneDialog
                open={this.state.openImage}
                onSave={this.handleSave.bind(this)}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={true}
                maxFileSize={20000}
                filesLimit={1}
                onClose={this.handleClose.bind(this)}
              />
              <small className='danger-error'>
                {smImageFileErrMsg ? smImageFileErrMsg : ''}
              </small>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Button
              id='createBtn'
              variant='contained'
              color='primary'
              className='btn-primary-users'
              onClick={this.handleAddUsers}
            >
              {this.state.createBtnText}
            </Button>
            <Button
              id='resetBtn'
              variant='contained'
              color='primary'
              className='btn-primary-users'
              onClick={this.handleResetUsers}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import MaterialTable from 'material-table';
import '../../styles/ManageProduct.scss';
import ManageProductController from '../../server/controllers/ManageProductController';
import Auth from '../../Auth';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';

export default class ManageProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputLabel: null,
      labelWidth: 135,
      openDialog: false,
      dialogMessage: 'New product added successfully!!',
      pId: '',
      pCategory: '',
      pName: '',
      pDesc: '',
      pPrice: '',
      pGSTRate: '',
      pStatus: true,
      hsnCode: '',
      pAvailableStock: '',
      createdOn: '',
      allProductCategories: [],
      errors: [],
      user: {},
      createBtnText: 'Create New Product',
      createBtnAction: 'create',
      openImage: false,
      imageFiles: [],
      imageFileName: 'no image selected',
      imageId: 0,
      showImageWithLink: 'hide-display',
      showImageWithoutLink: 'show-display',
      productHeader: [
        {
          title: 'Product Category',
          field: 'productCategoryName',
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' },
        },
        {
          title: 'Product Name',
          field: 'productName',
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' },
        },
        {
          title: 'HSN Code',
          field: 'hsnCode',
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' },
        },
        {
          title: 'Product Description',
          field: 'productDesc',
          cellStyle: { width: '20%', textAlign: 'left' },
          headerStyle: { width: '20%', textAlign: 'left' },
        },
        {
          title: 'Price (INR)',
          field: 'productPrice',
          type: 'numeric',
          cellStyle: { width: '10%', textAlign: 'center' },
          headerStyle: { width: '10%', textAlign: 'center' },
        },
        {
          title: 'GST Rate',
          field: 'productGstRate',
          type: 'numeric',
          cellStyle: { width: '5%', textAlign: 'center' },
          headerStyle: { width: '5%', textAlign: 'center' },
        },
        {
          title: 'Status',
          field: 'productStatus',
          lookup: { true: 'Active', false: 'Inactive' },
          cellStyle: { width: '10%', textAlign: 'left' },
          headerStyle: { width: '10%', textAlign: 'left' },
        },
        {
          title: 'Available Stock',
          field: 'productAvlStock',
          type: 'numeric',
          cellStyle: { width: '5%', textAlign: 'center' },
          headerStyle: { width: '5%', textAlign: 'center' },
        },
        {
          title: 'Image',
          field: 'productImageName',
          cellStyle: { width: '7%', textAlign: 'left' },
          headerStyle: { width: '7%', textAlign: 'left' },
          // onClick
        },
      ],
      productRowData: [],
    };
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  async componentDidMount() {
    if (Auth.isAuthenticated()) {
      this.fetchProductCategories();
      this.fetchAllProduct();
    } else {
      this.props.history.push('/');
    }
  }

  async fetchProductCategories() {
    const activeProductCategories = await ManageProductController.fetchAllProductCategoriesForStatus(
      true
    );
    // console.log("activeProductCategories : "+activeProductCategories);
    this.setState({ allProductCategories: activeProductCategories });
  }
  async fetchAllProduct() {
    const allProduct = await ManageProductController.fetchAllProduct();
    this.setState({ productRowData: allProduct });
  }

  handleAddProduct = async () => {
    if (this.validateAddProduct()) {
      const productData = {
        id: this.state.pId,
        productName: this.state.pName,
        productDesc: this.state.pDesc,
        price: this.state.pPrice,
        gstRate: this.state.pGSTRate,
        status: this.state.pStatus,
        availableStock: this.state.pAvailableStock,
        hsnCode: this.state.hsnCode,
        createdOn: this.state.createdOn,
        productCategory: {
          id: this.state.pCategory,
        },
        imageFiles: this.state.imageFiles,
        imageFileName: this.state.imageFileName,
        imageId: this.state.imageId,
      };

      const result = await ManageProductController.updateProduct(
        productData,
        this.state.createBtnAction
      );

      if (this.state.createBtnAction === 'edit') {
        this.setState({ dialogMessage: 'Product updated successfully!!' });
      } else if (this.state.createBtnAction === 'create') {
        this.setState({ dialogMessage: 'Product created successfully!!' });
      }

      if (result === 'success') {
        this.setState({ openDialog: true });
        this.fetchAllProduct();
        this.handleResetProduct();
      } else {
        this.setState({
          dialogMessage:
            'Internal error while adding a new product, please contact support!!',
        });
      }
    }
  };

  handleProductCategoryChange = async (event) => {
    const pCategory = event.target.value;
    // console.log('on change this.state.pCategory : ' + pCategory);
    const hsnCodeTemp = await ManageProductController.fetchProductCategory(
      pCategory
    );

    this.setState({
      pCategory: `${pCategory}`,
      hsnCode: `${hsnCodeTemp}`,
    });
  };

  validateAddProduct() {
    let valid = true;
    if (this.state.pCategory === '') {
      this.showValidationError('pCategory', 'Select a Product Category!');
      valid = false;
    }

    if (this.state.pName === '') {
      this.showValidationError('pName', 'Product Name can not be empty!');
      valid = false;
    }

    if (this.state.hsnCode === '') {
      this.showValidationError('hsnCode', 'HSN Code can not be empty!');
      valid = false;
    }

    if (this.state.pDesc === '') {
      this.showValidationError(
        'pDesc',
        'Product Description can not be empty!'
      );
      valid = false;
    }

    if (this.state.pPrice === '') {
      this.showValidationError('pPrice', 'Product Price can not be empty!');
      valid = false;
    } else if (isNaN(this.state.pPrice)) {
      this.showValidationError('pPrice', 'Invalid Product Price!');
      valid = false;
    }

    if (this.state.pGSTRate === '') {
      this.showValidationError(
        'pGSTRate',
        'Product GST Rate can not be empty!'
      );
      valid = false;
    } else if (isNaN(this.state.pGSTRate)) {
      this.showValidationError('pGSTRate', 'Invalid Product GST Rate!');
      valid = false;
    }

    if (this.state.pAvailableStock === '') {
      this.showValidationError(
        'pAvailableStock',
        'Product Available Stock can not be empty!'
      );
      valid = false;
    } else if (isNaN(this.state.pAvailableStock)) {
      this.showValidationError(
        'pAvailableStock',
        'Invalid Product Available Stock !'
      );
      valid = false;
    }

    return valid;
  }

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

  handleChange = (elem) => {
    this.setState({
      [elem.target.id]: elem.target.value,
    });
    this.clearValidationError(elem.target.id);
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

  handleResetProduct = () => {
    this.setState({
      pId: '',
      pCategory: '',
      pName: '',
      pDesc: '',
      pPrice: '',
      pGSTRate: '',
      pStatus: '',
      hsnCode: '',
      pAvailableStock: '',
      createBtnText: 'Create New Product',
      createBtnAction: 'create',
      openImage: false,
      imageFiles: [],
      imageFileName: 'no image selected',
      imageId: 0,
      showImageWithLink: 'hide-display',
      showImageWithoutLink: 'show-display',
    });

    this.clearAllValidationError();
  };

  onSelectionChanged(rowData) {
    this.setState({
      pId: rowData.productId,
      pCategory: rowData.productCategoryId,
      pName: rowData.productName,
      hsnCode: rowData.hsnCode,
      pDesc: rowData.productDesc,
      pPrice: rowData.productPrice,
      pGSTRate: rowData.productGstRate,
      pStatus: rowData.productStatus,
      pAvailableStock: rowData.productAvlStock,
      createdOn: rowData.createdOn,
      createBtnText: 'Edit Product',
      createBtnAction: 'edit',
      imageFileName: rowData.productImageName,
      imageId: rowData.imageId,
    });

    this.clearAllValidationError();

    this.setState({
      showImageWithLink: 'show-display',
      showImageWithoutLink: 'hide-display',
    });
  }

  handleStatusChange = (event) => {
    this.setState({ pStatus: event.target.value });
  };

  handleOpen() {
    this.setState({
      openImage: true,
    });
    this.clearValidationError('smImageFiles');
  }

  handleClose() {
    this.setState({
      openImage: false,
      showImageWithLink: 'hide-display',
      showImageWithoutLink: 'show-display',
    });
  }

  handleSave(files) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = (file) => {
      this.setState({
        imageFiles: file.target.result,
        imageFileName: files[0].name,
        openImage: false,
      });
    };
  }

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

  render() {
    let pCategoryErrMsg = null;
    let pNameErrMsg = null;
    let hsnCodeErrMsg = null;
    let pDescErrMsg = null;
    let pPriceErrMsg = null;
    let pGSTRateErrMsg = null;
    let imageFileErrMsg = null;
    let pAvailableStockErrMsg = null;

    for (let err of this.state.errors) {
      if (err.elem === 'pCategory') {
        pCategoryErrMsg = err.msg;
      }
      if (err.elem === 'pName') {
        pNameErrMsg = err.msg;
      }
      if (err.elem === 'hsnCode') {
        hsnCodeErrMsg = err.msg;
      }
      if (err.elem === 'pDesc') {
        pDescErrMsg = err.msg;
      }
      if (err.elem === 'pPrice') {
        pPriceErrMsg = err.msg;
      }
      if (err.elem === 'pGSTRate') {
        pGSTRateErrMsg = err.msg;
      }
      if (err.elem === 'pStatus') {
        imageFileErrMsg = err.msg;
      }
      if (err.elem === 'pAvailableStock') {
        pAvailableStockErrMsg = err.msg;
      }
    }
    return (
      <div>
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

        <div className='show-product-container'>
          <div>
            <MaterialTable
              title='All Product Details'
              columns={this.state.productHeader}
              data={this.state.productRowData}
              options={{
                columnsButton: true,
                exportButton: true,
                exportAllData: true,
              }}
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit Product',
                  onClick: (event, rowData) => this.onSelectionChanged(rowData),
                },
              ]}
            />
          </div>
        </div>
        <div className='create-product-container'>
          <div className='create-product-header'>
            <Typography variant='h6' component='h2'>
              Add a new Product
            </Typography>
          </div>
          <div className='create-product-sub-container'>
            <FormControl required variant='outlined' className='formControl'>
              <InputLabel ref={this.state.inputLabel} id='pCategory-label'>
                Product Category
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='pCategory'
                value={this.state.pCategory}
                labelWidth={this.state.labelWidth}
                className='selectEmpty'
                onChange={this.handleProductCategoryChange}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {this.state.allProductCategories.map((productCategory) => (
                  <MenuItem
                    key={productCategory.hsnCode}
                    value={productCategory.id}
                  >
                    {productCategory.productCategoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <small className='danger-error'>
              {pCategoryErrMsg ? pCategoryErrMsg : ''}
            </small>

            <TextField
              id='pName'
              label='Product Name'
              variant='outlined'
              fullWidth
              className='product-textfield'
              margin='normal'
              required={true}
              onChange={this.handleChange}
              value={this.state.pName}
            />
            <small className='danger-error'>
              {pNameErrMsg ? pNameErrMsg : ''}
            </small>

            <TextField
              id='hsnCode'
              label='HSN Code'
              variant='outlined'
              fullWidth
              className='product-textfield'
              margin='normal'
              required={true}
              onChange={this.handleChange}
              value={this.state.hsnCode}
            />
            <small className='danger-error'>
              {hsnCodeErrMsg ? hsnCodeErrMsg : ''}
            </small>

            <TextField
              id='pDesc'
              label='Product Description'
              variant='outlined'
              fullWidth
              required={true}
              className='product-textfield'
              margin='normal'
              onChange={this.handleChange}
              value={this.state.pDesc}
            />
            <small className='danger-error'>
              {pDescErrMsg ? pDescErrMsg : ''}
            </small>

            <TextField
              id='pPrice'
              label='Product Price'
              variant='outlined'
              fullWidth
              required={true}
              className='product-textfield'
              margin='normal'
              onChange={this.handleChange}
              value={this.state.pPrice}
            />
            <small className='danger-error'>
              {pPriceErrMsg ? pPriceErrMsg : ''}
            </small>

            <TextField
              id='pGSTRate'
              label='Product GST Rate'
              variant='outlined'
              fullWidth
              required={true}
              className='product-textfield'
              margin='normal'
              onChange={this.handleChange}
              value={this.state.pGSTRate}
            />
            <small className='danger-error'>
              {pGSTRateErrMsg ? pGSTRateErrMsg : ''}
            </small>

            <FormControl required variant='outlined' className='formControl'>
              <InputLabel ref={this.state.inputLabel} id='product-label'>
                Product Status
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='pcStatus'
                value={this.state.pStatus}
                labelWidth={this.state.labelWidth}
                className='selectEmpty'
                onChange={this.handleStatusChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id='pAvailableStock'
              label='Product Available Stock'
              variant='outlined'
              fullWidth
              required={true}
              className='product-textfield'
              margin='normal'
              onChange={this.handleChange}
              value={this.state.pAvailableStock}
            />
            <small className='danger-error'>
              {pAvailableStockErrMsg ? pAvailableStockErrMsg : ''}
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
                  Upload Product Image
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
                {imageFileErrMsg ? imageFileErrMsg : ''}
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
              className='btn-primary-product'
              onClick={this.handleAddProduct}
            >
              {this.state.createBtnText}
            </Button>
            <Button
              id='resetBtn'
              variant='contained'
              color='primary'
              className='btn-primary-product'
              onClick={this.handleResetProduct}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

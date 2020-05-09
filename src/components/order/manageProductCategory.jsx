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
    DialogTitle, InputLabel, Select, MenuItem, FormControl
} from '@material-ui/core';
import SearchSharp from '@material-ui/icons/SearchSharp';
import '../../styles/ManageProductCategory.scss';
import ManageProductCategoryController from '../../server/controllers/ManageProductCategoryController';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Auth from '../../Auth';

export default class ManageProductCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputLabel: null,
            labelWidth: 185,
            openDialog: false,
            dialogMessage: '',
            modules: AllCommunityModules,
            pcId: '',
            pcName: '',
            pcDescription: '',
            pcStatus: true,
            hsnCode: '',
            createdOn: '',
            createBtnAction: 'create',
            createBtnText: 'Create a Product Category',
            errors: [],
            user: {},
            productCategoryColumnsDef: [
                {
                    headerName: 'Product Category Name',
                    field: 'productCategoryName',
                    sortable: true,
                    checkboxSelection: true,
                    width: 230,
                    suppressSizeToFit: true
                },
                {
                    headerName: 'HSN Code',
                    field: 'hsnCode',
                    sortable: true,
                    width: 150,
                },
                {
                    headerName: 'Product Category Description',
                    field: 'productCategoryDesc',
                    sortable: true,
                    width: 280
                },
                {
                    headerName: 'Status',
                    field: 'productCategoryStatus',
                    sortable: true,
                    width: 100
                }
            ],
            rowSelection: 'single',
            defaultColDef: { resizable: true },
            productCategoryRowData: null
        };
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };

    async componentDidMount() {
        if (Auth.isAuthenticated()) {
            this.fetchAllProductCategories();
        } else {
            this.props.history.push('/');
        }
    }

    async fetchAllProductCategories() {
        const allProductCategories = await ManageProductCategoryController.fetchAllProductCategories();
        this.setState({ productCategoryRowData: allProductCategories });
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

    handleAddProductCategory = async elem => {
        if (this.validateAddProductCategory()) {
            const result = await ManageProductCategoryController.addNewProductCategory(
                this.state.pcName,
                this.state.pcDescription,
                this.state.pcStatus,
                this.state.pcId,
                this.state.createBtnAction,
                this.state.hsnCode,
                this.state.createdOn
            );

            if (result === 'success') {
                if (this.state.createBtnAction === 'create') {
                    this.setState({ dialogMessage: 'Product Category added successfully!!' });
                } else {
                    this.setState({ dialogMessage: 'Product Category updated successfully!!' });
                }

                this.setState({ openDialog: true });
                this.fetchAllProductCategories();
                this.handleResetProductCategory();
            } else {
                this.setState({
                    dialogMessage:
                        'Internal error while adding a Product Category, please contact support!!'
                });
            }
        } else {
            return false;
        }
    };

    validateAddProductCategory() {
        let valid = true;
        if (this.state.pcName === '') {
            this.showValidationError('pcName', 'Product Category Name can not be empty!');
            valid = false;
        }

        if (this.state.pcDescription === '') {
            this.showValidationError(
                'pcDescription',
                'Product Category Description can not be empty!'
            );
            valid = false;
        }

        if (this.state.hsnCode === '') {
            this.showValidationError(
                'hsnCode',
                'HSN Code can not be empty!'
            );
            valid = false;
        }

        return valid;
    }

    handleResetProductCategory = elem => {
        this.setState({
            pcName: '',
            pcDescription: '',
            pcStatus: true,
            hsnCode: '',
            createBtnText: 'Create a Product Category',
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
        if (selectedRows && selectedRows.length > 0) {
            this.setState({
                pcName: selectedRows[0].productCategoryName,
                pcDescription: selectedRows[0].productCategoryDesc,
                pcStatus: selectedRows[0].status,
                hsnCode: selectedRows[0].hsnCode,
                createdOn: selectedRows[0].createdOn,
                createBtnText: 'Edit Product Category',
                createBtnAction: 'edit',
                pcId: selectedRows[0].productCategoryId
            });

            this.clearAllValidationError();
        } else {
            this.handleResetProductCategory();
        }
    }

    handleStatusChange = (event) => {
        this.setState({ pcStatus: event.target.value });
    }

    render() {
        let pcNameErrMsg = null;
        let pcDescriptionErrMsg = null;
        let hsnCodeErrMsg = null;

        for (let err of this.state.errors) {
            if (err.elem === 'pcName') {
                pcNameErrMsg = err.msg;
            }
            if (err.elem === 'pcDescription') {
                pcDescriptionErrMsg = err.msg;
            }
            if (err.elem === 'hsnCode') {
                hsnCodeErrMsg = err.msg;
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

                <div className='show-product-category-container'>
                    <div className='create-product-category-header'>
                        <Typography variant='h6' component='h2'>
                            All Product Category Details
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
                                )
                            }}
                            onInput={this.onQuickFilterChanged.bind(this)}
                        />
                    </div>
                    <div className='product-category-grid'>
                        <div className='ag-theme-balham productCategoryDetailsTable'>
                            <AgGridReact
                                columnDefs={this.state.productCategoryColumnsDef}
                                rowData={this.state.productCategoryRowData}
                                rowSelection={this.state.rowSelection}
                                modules={this.state.modules}
                                defaultColDef={this.state.defaultColDef}
                                onGridReady={this.onGridReady}
                                onRowSelected={this.onSelectionChanged.bind(this)}
                            />
                        </div>
                    </div>
                </div>

                <div className='create-product-category-container'>
                    <div className='create-product-category-header'>
                        <Typography variant='h6' component='h2'>
                            Add a new Product Category
                        </Typography>
                    </div>
                    <div style={{ width: '100%', float: 'left' }}>
                        <TextField
                            id='pcName'
                            label='Product Category Name'
                            variant='outlined'
                            fullWidth
                            className='product-category-textfield'
                            margin='normal'
                            required={true}
                            onChange={this.handleChange}
                            value={this.state.pcName}
                        />
                        <small className='danger-error'>
                            {pcNameErrMsg ? pcNameErrMsg : ''}
                        </small>

                        <TextField
                            id='hsnCode'
                            label='HSN Code'
                            variant='outlined'
                            fullWidth
                            className='product-category-textfield'
                            margin='normal'
                            required={true}
                            onChange={this.handleChange}
                            value={this.state.hsnCode}
                        />
                        <small className='danger-error'>
                            {hsnCodeErrMsg ? hsnCodeErrMsg : ''}
                        </small>

                        <TextField
                            id='pcDescription'
                            label='Product Category Description'
                            variant='outlined'
                            fullWidth
                            required={true}
                            className='product-category-textfield'
                            margin='normal'
                            onChange={this.handleChange}
                            value={this.state.pcDescription}
                        />
                        <small className='danger-error'>
                            {pcDescriptionErrMsg ? pcDescriptionErrMsg : ''}
                        </small>

                        <FormControl required variant="outlined" className="formControl">
                            <InputLabel ref={this.state.inputLabel} id="pCategory-label">
                                Product Category Status
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="pcStatus"
                                value={this.state.pcStatus}
                                labelWidth={this.state.labelWidth}
                                className='selectEmpty'
                                onChange={this.handleStatusChange}
                            >
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>Inactive</MenuItem>
                            </Select>
                        </FormControl>

                        <br></br>
                        <br></br>
                        <Button
                            id='createBtn'
                            variant='contained'
                            color='primary'
                            className='btn-primary-product-category'
                            onClick={this.handleAddProductCategory}
                        >
                            {this.state.createBtnText}
                        </Button>
                        <Button
                            id='resetBtn'
                            variant='contained'
                            color='primary'
                            className='btn-primary-product-category'
                            onClick={this.handleResetProductCategory}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

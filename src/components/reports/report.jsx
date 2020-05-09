import React from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import ReportsController from '../../server/controllers/ReportsController';
import {
  FormControl,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import '../../styles/Reports.scss';
import { useHistory } from 'react-router-dom';
import Auth from '../../Auth';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function Reports() {
  const classes = useStyles();
  const [reportType, setReportType] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState('');
  const [dialogMsg, setDialogMsg] = React.useState('');
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [classShowOrderReport, setClassShowOrderReport] = React.useState(
    'hideElement'
  );
  const [reportHeading] = React.useState('All Dispatched Orders');
  const [reportOrderHeader] = React.useState([
    {
      title: 'Order Number',
      field: 'orderNumber',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Order Raised By',
      field: 'orderRaisedBy',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Order Raised On',
      field: 'orderRaisedOn',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Customer Name',
      field: 'orderCustomerName',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Order Dispatched On',
      field: 'orderDispatchedOn',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Order Price (INR)',
      field: 'orderPrice',
      type: 'numeric',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Order GST Amount',
      field: 'orderGstAmount',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Order Status',
      field: 'orderStatus',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Product Name',
      field: 'productName',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Product Price',
      field: 'productPrice',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Product Gst Rate',
      field: 'productGstRate',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    },
    {
      title: 'Product Quantity',
      field: 'productQuantity',
      headerStyle: { width: '8%', textAlign: 'center' },
      cellStyle: { width: '8%', textAlign: 'center' }
    }
  ]);

  const [reportOrderDetails, setReportOrderDetails] = React.useState([]);
  const history = useHistory();
  React.useEffect(() => {
    if (!Auth.isAuthenticated()) {
      history.push('/');
    }
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleReportTypeChange = event => {
    setReportType(event.target.value);
  };

  const handleStartDateChange = date => {
    setSelectedStartDate(date);
  };
  const handleEndDateChange = date => {
    setSelectedEndDate(date);
  };

  const handleGenerateReport = async event => {
    //do stuffs here to generate repport
    let errMsg = '';
    if (reportType === '') {
      errMsg = 'Select a Report type\n';
    }

    if (selectedStartDate > selectedEndDate) {
      errMsg += 'From Date can not be greater than End date';
    }

    if (errMsg === '') {
      if (reportType === 1) {
        const reportData = await ReportsController.fetchOrders(
          'DISPATCHED',
          selectedStartDate,
          selectedEndDate
        );
        setReportOrderDetails(reportData);
        setClassShowOrderReport('showElement');
      }
    } else {
      setDialogMsg(errMsg);
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className='container'>
      <Dialog
        open={openDialog ? openDialog : false}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{''}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {dialogMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary' autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <div className='reports-container'>
        <div className='reports-header'>
          <Typography variant='h6' component='h2'>
            MIS Reports
          </Typography>
        </div>
        <div className='filtersDiv'>
          <div className='reportTypeDiv'>
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel
                ref={inputLabel}
                id='demo-simple-select-outlined-label'
              >
                Select a Report Type
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={reportType}
                onChange={handleReportTypeChange}
                labelWidth={labelWidth}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>All Dispatched Orders</MenuItem>
                <MenuItem value={2}>Product Details</MenuItem>
                <MenuItem value={3}>Users Details</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='startDateDiv'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify='space-around'>
                <KeyboardDatePicker
                  margin='normal'
                  id='date-picker-dialog'
                  label='From Date'
                  format='dd/MM/yyyy'
                  value={selectedStartDate}
                  onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
          <div className='endDateDiv'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify='space-around'>
                <KeyboardDatePicker
                  margin='normal'
                  id='date-picker-dialog-end'
                  label='End Date'
                  format='dd/MM/yyyy'
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
          <div className='buttonDiv'>
            <Button
              id='createBtn'
              variant='contained'
              color='primary'
              className='btn-primary-users'
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </div>
        </div>
        <div className='report-body'>
          <div className={classShowOrderReport}>
            <MaterialTable
              title={reportHeading}
              columns={reportOrderHeader}
              data={reportOrderDetails}
              options={{
                exportButton: true
              }}
              emptyRowsWhenPaging={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

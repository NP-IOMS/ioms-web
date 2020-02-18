import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './styles/MainBody.scss';
import { Paper } from '@material-ui/core';

// import HomePage from './components/homepage/homepage';
import ManageInventoryPage from './components/order/manageInventory';
import ManageSalesmenPage from './components/salesmen/manageSalesmen';
import ManageOrdersPage from './components/order/manageOrders';
import ReportsPage from './components/reports/report';
import ProtectedRoute from './ProtectedRoute';

export default class Routes extends Component {
  render() {
    return (
      <main className='main-body'>
        <Paper className='main-body-container'>
          <Switch>
            {/*<ProtectedRoute component={HomePage} exact path='/ioms/home/' />*/}
            <ProtectedRoute
              component={ManageInventoryPage}
              exact
              path='/ioms/manage/inventory/'
            />
            <ProtectedRoute
              component={ManageSalesmenPage}
              exact
              path='/ioms/manage/salesmen/'
            />
            <ProtectedRoute
              component={ManageOrdersPage}
              exact
              path='/ioms/home/'
            />
            <ProtectedRoute
              component={ReportsPage}
              exact
              path='/ioms/reports/'
            />
            <Route extract path='*' component={() => '404 Not Found'} />
          </Switch>
        </Paper>
      </main>
    );
  }
}

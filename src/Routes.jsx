import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './styles/MainBody.scss';
import { Paper } from '@material-ui/core';

import HomePage from './components/homepage/homepage';
import ManageInventoryPage from './components/order/manageInventory';
import ManageSalesmenPage from './components/salesmen/manageSalesmen';
import ManageOrdersPage from './components/order/manageOrders';
import ReprotsPage from './components/reports/report';

export default class Routes extends Component {
  render() {
    return (
      <main className='main-body'>
        <Paper className='main-body-container'>
          <Switch>
            <Route component={HomePage} exact path='/ioms/home/' />
            <Route
              component={ManageInventoryPage}
              exact
              path='/ioms/manage/inventory/'
            />
            <Route
              component={ManageSalesmenPage}
              exact
              path='/ioms/manage/salesmen/'
            />
            <Route
              component={ManageOrdersPage}
              exact
              path='/ioms/manage/orders/'
            />
            <Route component={ReprotsPage} exact path='/ioms/reports/' />
          </Switch>
        </Paper>
      </main>
    );
  }
}

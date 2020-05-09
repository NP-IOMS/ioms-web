import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './styles/MainBody.scss';
import { Paper } from '@material-ui/core';

// import HomePage from './components/homepage/homepage';
import ManageProductPage from './components/order/manageProduct';
import ManageUsersPage from './components/users/manageUsers';
import ManageOrdersPage from './components/order/manageOrders';
import ManageProductCategory from "./components/order/manageProductCategory";
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
                component={ManageProductCategory}
                exact
                path='/ioms/manage/product/category'
            />
            <ProtectedRoute
              component={ManageProductPage}
              exact
              path='/ioms/manage/product/'
            />
            <ProtectedRoute
              component={ManageUsersPage}
              exact
              path='/ioms/manage/user/'
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

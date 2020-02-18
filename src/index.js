/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import ProtectedRoute from './ProtectedRoute';

import store from './redux/store';
import Loginpage from './components/login/loginpage';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path='/ioms/*'>
          <App />
        </ProtectedRoute>
        <Route extract path='/' component={Loginpage} />
        <Route extract path='*' component={() => '404 Not Found'} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

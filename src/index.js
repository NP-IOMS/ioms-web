/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';

import store from './redux/store';
import Loginpage from './components/login/loginpage';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path='/ioms/*'>
          <App />
        </Route>
        <Route component={Loginpage} path='/' />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

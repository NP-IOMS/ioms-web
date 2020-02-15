/* eslint-disable react/jsx-filename-extension */
import React, { PureComponent } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import {
  faBook,
  faCat,
  faChartArea,
  faClipboard,
  faFileSignature,
  faHome,
  faImages,
  faUsers,
  faClock,
  faUserEdit,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons';
import './styles/App.css';
import MainApp from './MainApp';

// Import fonts required

library.add(
  faBook,
  faCat,
  faChartArea,
  faClipboard,
  faFileSignature,
  faHome,
  faImages,
  faUsers,
  faClock,
  faUserEdit,
  faUserFriends
);

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(',')
  },
  palette: {
    primary: {
      light: '#2196f3',
      main: '#1565c0',
      dark: '#0d47a1',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ec407a',
      main: '#d81b60',
      dark: '#880e4f',
      contrastText: '#fff'
    }
  }
});

class App extends PureComponent {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className='App'>
          <MainApp />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;

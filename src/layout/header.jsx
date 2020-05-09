import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Auth from '../Auth';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Grid
} from '@material-ui/core';
import {
  ExitToApp,
  KeyboardBackspaceRounded,
  MenuRounded
} from '@material-ui/icons';

import '../styles/Header.scss';

class Header extends Component {
  render() {
    const { open, onOpen, onClose } = this.props;
    return (
      <div className='site-header-container'>
        <AppBar position='fixed'>
          <Toolbar className='toolbar' variant='dense'>
            <Grid
              container
              direction='row'
              justify='space-around'
              alignItems='center'
            >
              <Grid item>
                {open ? (
                  <IconButton
                    className='menu-button'
                    color='inherit'
                    edge='start'
                    onClick={onClose}
                  >
                    <KeyboardBackspaceRounded />
                  </IconButton>
                ) : (
                  <IconButton
                    className='menu-button'
                    color='inherit'
                    edge='start'
                    onClick={onOpen}
                  >
                    <MenuRounded />
                  </IconButton>
                )}
              </Grid>

              <Grid item md={7} xs={3}>
                <Typography className='title' variant='h5'>
                  <Link to='/'>Order Management System</Link>
                </Typography>
                <Typography className='titleSmall' variant='h5'>
                  <Link to='/'>IOMS</Link>
                </Typography>
              </Grid>

              <Grid
                item
                md={1}
                xs={3}
                className='account-notification-container'
              >
                <Grid
                  container
                  direction='row'
                  justify='space-evenly'
                  alignItems='center'
                >
                  <Grid item>
                    <IconButton
                      aria-label='Sign Out'
                      onClick={() => {
                        Auth.logout(() => {
                          this.props.history.push('/');
                        });
                      }}
                      color='inherit'
                      tooltip={'Sign Out'}
                    >
                      <ExitToApp />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);

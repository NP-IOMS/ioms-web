import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Badge,
  IconButton,
  Toolbar,
  Typography,
  Grid
} from '@material-ui/core';
import {
  AccountCircle,
  KeyboardBackspaceRounded,
  MenuRounded,
  Notifications
} from '@material-ui/icons';

import '../Styles/Header.scss';
export default class Header extends Component {
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
                  <Link to='/'>Inventory and Order Management System</Link>
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
                    <IconButton color='inherit'>
                      <Badge badgeContent={17} color='secondary'>
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label='show more'
                      // onClick={handleMobileMenuOpen}
                      color='inherit'
                      tooltip={'Sign Out'}
                    >
                      <AccountCircle />
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

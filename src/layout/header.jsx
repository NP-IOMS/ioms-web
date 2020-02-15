import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Grid
} from '@material-ui/core';
import {
  AccountCircle,
  KeyboardBackspaceRounded,
  MenuRounded
} from '@material-ui/icons';

import '../styles/Header.scss';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      user: {}
    };
  }

  componentDidMount() {
    // if(this.props.location && this.props.location.state && this.props.location.state.user) {
    //   this.state.user = this.props.location.state.user;
    // } else {
    //   this.props.history.push('/');
    // }
  }

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

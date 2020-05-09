import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Sidebar.scss';
import ArrowTooltip from '../components/common/arrowTooltip';
import Auth from '../Auth';

export default class Sidebar extends Component {
  render() {
    let { open } = this.props;
    if (Auth.getUserInfo().userRoleName === 'ADMIN') {
      return (
        <Drawer
          variant='permanent'
          className={'sidebar ' + (open ? 'sidebar-open' : 'sidebar-close')}
          open={open}
        >
          <List>
            <Divider />
            <Link to='/ioms/home/'>
              <ArrowTooltip title='Home' placement='right'>
                <ListItem button className='font-awesome-icon menu-text'>
                  <ListItemIcon>
                    <FontAwesomeIcon icon='home' size='2x' />
                  </ListItemIcon>
                  <ListItemText primary='Home' />
                </ListItem>
              </ArrowTooltip>
            </Link>
            <Divider />
            <Link to='/ioms/manage/product/category'>
              <ArrowTooltip title='Manage Product Category' placement='right'>
                <ListItem button className='material-ui-icon menu-text'>
                  <ListItemIcon>
                    <FontAwesomeIcon icon='file-signature' size='2x' />
                  </ListItemIcon>
                  <ListItemText primary='Manage Product Category' />
                </ListItem>
              </ArrowTooltip>
            </Link>
            <Divider />
            <Link to='/ioms/manage/product/'>
              <ArrowTooltip title='Manage Product' placement='right'>
                <ListItem button className='material-ui-icon menu-text'>
                  <ListItemIcon>
                    <FontAwesomeIcon icon='file-signature' size='2x' />
                  </ListItemIcon>
                  <ListItemText primary='Manage Product' />
                </ListItem>
              </ArrowTooltip>
            </Link>
            <Divider />
            <Link to='/ioms/manage/user/'>
              <ArrowTooltip title='Manage Users' placement='right'>
                <ListItem button className='material-ui-icon menu-text'>
                  <ListItemIcon>
                    <FontAwesomeIcon icon='users' size='2x' />
                  </ListItemIcon>
                  <ListItemText primary='Manage Users'/>
                </ListItem>
              </ArrowTooltip>
            </Link>
            <Divider />
            <Link to='/ioms/reports/'>
              <ArrowTooltip title='Reports' placement='right'>
                <ListItem button className='font-awesome-icon menu-text'>
                  <ListItemIcon>
                    <FontAwesomeIcon icon='book' size='2x'/>
                  </ListItemIcon>
                  <ListItemText primary='Reports' />
                </ListItem>
              </ArrowTooltip>
            </Link>
          </List>
        </Drawer>
      );
    } else {
      return (
        <div>
          <h1>404 - Not Found</h1>
        </div>
      );
    }
  }
}

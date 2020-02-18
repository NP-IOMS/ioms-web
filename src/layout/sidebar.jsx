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

export default class Sidebar extends Component {
  render() {
    let { open } = this.props;
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
              <ListItem button className='font-awesome-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='home' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Home' />
              </ListItem>
            </ArrowTooltip>
          </Link>
          <Divider />
          <Link to='/ioms/manage/inventory/'>
            <ArrowTooltip title='Manage Inventory' placement='right'>
              <ListItem button className='material-ui-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='file-signature' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Manage Inventory' />
              </ListItem>
            </ArrowTooltip>
          </Link>
          <Divider />
          <Link to='/ioms/manage/salesmen/'>
            <ArrowTooltip title='Manage Salesmen' placement='right'>
              <ListItem button className='material-ui-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='users' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Manage Salesmen' />
              </ListItem>
            </ArrowTooltip>
          </Link>
          <Divider />
{/*          <Link to='/ioms/manage/orders/'>
            <ArrowTooltip title='Manage Orders' placement='right'>
              <ListItem button className='font-awesome-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='images' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Manage Orders' />
              </ListItem>
            </ArrowTooltip>
          </Link>
          <Divider />*/}
          <Link to='/ioms/reports/'>
            <ArrowTooltip title='Reports' placement='right'>
              <ListItem button className='font-awesome-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='book' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Reports' />
              </ListItem>
            </ArrowTooltip>
          </Link>
        </List>
      </Drawer>
    );
  }
}

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
import '../Styles/Sidebar.scss';
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
          <ArrowTooltip title='Home' placement='right'>
            <Link to='/ioms/home/'>
              <ListItem button className='font-awesome-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='home' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Home' />
              </ListItem>
            </Link>
          </ArrowTooltip>
          <Divider />
          <ArrowTooltip title='Manage Salesmen' placement='right'>
            <Link to='/ioms/manage/salesmen/'>
              <ListItem button className='material-ui-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='users' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Manage Salesmen' />
              </ListItem>
            </Link>
          </ArrowTooltip>
          <Divider />
          <ArrowTooltip title='Manage Orders' placement='right'>
            <Link to='/ioms/manage/orders/'>
              <ListItem button className='font-awesome-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='images' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Manage Orders' />
              </ListItem>
            </Link>
          </ArrowTooltip>
          <Divider />
          <ArrowTooltip title='Reports' placement='right'>
            <Link to='/ioms/reports/'>
              <ListItem button className='font-awesome-icon'>
                <ListItemIcon>
                  <FontAwesomeIcon icon='book' size='2x' />
                </ListItemIcon>
                <ListItemText primary='Reports' />
              </ListItem>
            </Link>
          </ArrowTooltip>
        </List>
      </Drawer>
    );
  }
}

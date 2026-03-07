/*
 *
 * Shipping
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import actions from '../../actions';
import List from './List';
import Add from './Add';
import Edit from './Edit';
import Page404 from '../../components/Common/Page404';

class Shipping extends React.PureComponent {
  render() {
    return (
      <div className='shipping-dashboard'>
        <Switch>
          <Route exact path='/dashboard/shipping' component={List} />
          <Route exact path='/dashboard/shipping/edit/:id' component={Edit} />
          <Route exact path='/dashboard/shipping/add' component={Add} />
          <Route path='*' component={Page404} />
        </Switch>
      </div>
    );
  }
}

export default connect(null, actions)(Shipping);

/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import ShippingList from '../../components/Manager/ShippingList';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchShippingOptions();
  }

  render() {
    const { history, shippingOptions, isLoading } = this.props;

    return (
      <>
        <SubPage
          title='Shipping Options'
          actionTitle='Add Shipping Option'
          handleAction={() => history.push('/dashboard/shipping/add')}
        >
          {isLoading ? (
            <LoadingIndicator inline />
          ) : shippingOptions.length > 0 ? (
            <ShippingList shippingOptions={shippingOptions} />
          ) : (
            <NotFound message='No shipping options found.' />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    shippingOptions: state.shipping.shippingOptions,
    isLoading: state.shipping.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);

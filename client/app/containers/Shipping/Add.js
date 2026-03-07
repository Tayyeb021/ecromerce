/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddShipping from '../../components/Manager/AddShipping';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  render() {
    const {
      history,
      shippingFormData,
      formErrors,
      shippingChange,
      addShippingOption,
      resetShippingForm
    } = this.props;

    return (
      <SubPage
        title='Add Shipping Option'
        actionTitle='Cancel'
        handleAction={() => {
          resetShippingForm();
          history.goBack();
        }}
      >
        <AddShipping
          shippingFormData={shippingFormData}
          formErrors={formErrors}
          shippingChange={shippingChange}
          addShippingOption={addShippingOption}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    shippingFormData: state.shipping.shippingFormData,
    formErrors: state.shipping.formErrors
  };
};

export default connect(mapStateToProps, actions)(Add);

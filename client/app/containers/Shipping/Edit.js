/*
 *
 * Edit
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddShipping from '../../components/Manager/AddShipping';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Edit extends React.PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchShippingOption(id);
  }

  render() {
    const {
      history,
      shippingFormData,
      formErrors,
      shippingChange,
      updateShippingOption,
      resetShippingForm,
      isLoading
    } = this.props;

    return (
      <SubPage
        title='Edit Shipping Option'
        actionTitle='Cancel'
        handleAction={() => {
          resetShippingForm();
          history.goBack();
        }}
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <AddShipping
            shippingFormData={shippingFormData}
            formErrors={formErrors}
            shippingChange={shippingChange}
            addShippingOption={updateShippingOption}
            isEdit={true}
            shippingOptionId={this.props.match.params.id}
          />
        )}
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    shippingFormData: state.shipping.shippingFormData,
    formErrors: state.shipping.formErrors,
    isLoading: state.shipping.isLoading
  };
};

export default connect(mapStateToProps, actions)(Edit);

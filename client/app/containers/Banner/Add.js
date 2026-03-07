/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddBanner from '../../components/Manager/AddBanner';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchCategories();
  }

  render() {
    const {
      history,
      categories,
      bannerFormData,
      formErrors,
      bannerChange,
      addBanner
    } = this.props;

    return (
      <SubPage
        title='Add Banner'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddBanner
          categories={categories}
          bannerFormData={bannerFormData}
          formErrors={formErrors}
          bannerChange={bannerChange}
          addBanner={addBanner}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.category.storeCategories,
    bannerFormData: state.banner.bannerFormData,
    formErrors: state.banner.formErrors
  };
};

export default connect(mapStateToProps, actions)(Add);

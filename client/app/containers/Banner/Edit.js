/*
 *
 * Edit
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import EditBanner from '../../components/Manager/EditBanner';
import SubPage from '../../components/Manager/SubPage';

class Edit extends React.PureComponent {
  componentDidMount() {
    const { match, fetchBanner, fetchCategories } = this.props;
    fetchBanner(match.params.id);
    fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.fetchBanner(this.props.match.params.id);
    }
  }

  render() {
    const {
      history,
      categories,
      bannerFormEditData,
      formEditErrors,
      bannerEditChange,
      updateBanner,
      match
    } = this.props;

    return (
      <SubPage
        title='Edit Banner'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <EditBanner
          categories={categories}
          bannerFormEditData={bannerFormEditData}
          formEditErrors={formEditErrors}
          bannerEditChange={bannerEditChange}
          updateBanner={updateBanner}
          bannerId={match.params.id}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.category.storeCategories,
    bannerFormEditData: state.banner.bannerFormEditData,
    formEditErrors: state.banner.formEditErrors
  };
};

export default connect(mapStateToProps, actions)(Edit);

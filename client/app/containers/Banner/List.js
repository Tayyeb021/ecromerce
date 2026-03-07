/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import BannerList from '../../components/Manager/BannerList';
import SubPage from '../../components/Manager/SubPage';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class List extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBanners();
  }

  render() {
    const { history, banners, isLoading } = this.props;

    return (
      <>
        <SubPage
          title='Banners'
          actionTitle='Add Banner'
          handleAction={() => history.push('/dashboard/banner/add')}
        >
          {isLoading ? (
            <LoadingIndicator inline />
          ) : banners.length > 0 ? (
            <BannerList banners={banners} deleteBanner={this.props.deleteBanner} />
          ) : (
            <NotFound message='No banners found.' />
          )}
        </SubPage>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    banners: state.banner.banners,
    isLoading: state.banner.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);

/**
 *
 * CategoryShop
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import Breadcrumb from '../../components/Common/Breadcrumb';

class CategoryShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts('category', slug);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.filterProducts('category', slug);
    }
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist, categories } = this.props;
    const slug = this.props.match.params.slug;
    const category = categories?.find(cat => cat.slug === slug);
    const categoryName = category?.name || slug;

    return (
      <div className='category-shop'>
        <Breadcrumb categoryName={categoryName} />
        {isLoading && <LoadingIndicator />}
        {products && products.length > 0 && (
          <ProductList
            products={products}
            authenticated={authenticated}
            updateWishlist={updateWishlist}
            cartItems={[]}
          />
        )}
        {!isLoading && products && products.length <= 0 && (
          <NotFound message='No products found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated,
    categories: state.category.storeCategories
  };
};

export default connect(mapStateToProps, actions)(CategoryShop);

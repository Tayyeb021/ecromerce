/**
 *
 * Related Products Component
 *
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import actions from '../../../actions';
import ProductList from '../ProductList';
import LoadingIndicator from '../../Common/LoadingIndicator';

const RelatedProducts = ({ product, filterProducts, products, isLoading, authenticated, updateWishlist, cartItems }) => {
  const [relatedProducts, setRelatedProducts] = React.useState([]);

  useEffect(() => {
    if (product && product.brand && product.brand.slug) {
      // Filter products from the same brand
      filterProducts('brand', product.brand.slug);
    }
  }, [product]);

  useEffect(() => {
    // Filter out the current product and limit to 4
    if (products && products.length > 0) {
      const filtered = products.filter(p => p._id !== product?._id).slice(0, 4);
      setRelatedProducts(filtered);
    }
  }, [products, product]);

  if (!relatedProducts.length && !isLoading) return null;

  return (
    <section className='related-products-section'>
      <Container>
        <div className='section-header'>
          <h2 className='section-title'>Related Products</h2>
          <p className='section-subtitle'>You might also like</p>
        </div>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <div className='related-products-list'>
            <ProductList
              products={relatedProducts}
              authenticated={authenticated}
              updateWishlist={updateWishlist}
              cartItems={cartItems || []}
            />
          </div>
        )}
      </Container>
    </section>
  );
};

const mapStateToProps = state => ({
  products: state.product.storeProducts,
  isLoading: state.product.isLoading,
  authenticated: state.authentication.authenticated,
  cartItems: state.cart.cartItems
});

export default connect(mapStateToProps, actions)(RelatedProducts);

/**
 *
 * ProductPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';
import { trackViewContent, trackAddToCart } from '../../utils/pixel';
import { getImageUrl } from '../../utils/image';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import { BagIcon } from '../../components/Common/Icon';
import ProductReviews from '../../components/Store/ProductReviews';
import SocialShare from '../../components/Store/SocialShare';
import Breadcrumb from '../../components/Common/Breadcrumb';
import ProductImageGallery from '../../components/Store/ProductImageGallery';

class ProductPage extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.fetchStoreProduct(slug);
    this.props.fetchProductReviews(slug);
    document.body.classList.add('product-page');
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.fetchStoreProduct(slug);
      this.props.fetchProductReviews(slug);
    }
    if (
      this.props.product &&
      this.props.product._id &&
      (!prevProps.product || prevProps.product._id !== this.props.product._id)
    ) {
      trackViewContent(this.props.product);
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('product-page');
  }

  render() {
    const {
      isLoading,
      product,
      productShopData,
      shopFormErrors,
      itemInCart,
      productShopChange,
      handleAddToCart,
      handleRemoveFromCart,
      addProductReview,
      reviewsSummary,
      reviews,
      reviewFormData,
      reviewChange,
      reviewFormErrors,
      authenticated,
      updateWishlist
    } = this.props;

    return (
      <div className='product-shop'>
        {isLoading ? (
          <LoadingIndicator />
        ) : product && Object.keys(product).length > 0 && product._id ? (
          <>
            <Breadcrumb productName={product.name} />
            <Row className='flex-row'>
              <Col xs='12' md='5' lg='5' className='mb-3 px-3 px-md-2'>
                <div className='position-relative'>
                  <ProductImageGallery
                    images={
                      product.images && product.images.length > 0
                        ? product.images.map(img => {
                          const url = typeof img === 'string' ? img : (img.imageUrl || img);
                          return getImageUrl(url);
                        })
                        : product.imageUrl
                          ? [getImageUrl(product.imageUrl)]
                          : ['/images/placeholder-image.png']
                    }
                    productName={product.name}
                  />
                  {product.inventory <= 0 && !shopFormErrors['quantity'] ? (
                    <p className='stock out-of-stock'>Out of stock</p>
                  ) : (
                    <p className='stock in-stock'>In stock</p>
                  )}
                </div>
              </Col>
              <Col xs='12' md='7' lg='7' className='mb-3 px-3 px-md-2'>
                <div className='product-container'>
                  <div className='item-box'>
                    <div className='item-details'>
                      <h1 className='item-name one-line-ellipsis'>
                        {product.name}
                      </h1>
                      <p className='sku'>{product.sku}</p>
                      <hr />
                      {product.brand && (
                        <p className='by'>
                          see more from{' '}
                          <Link
                            to={`/shop/brand/${product.brand.slug}`}
                            className='default-link'
                          >
                            {product.brand.name}
                          </Link>
                        </p>
                      )}
                      <p className='item-desc'>{product.description}</p>
                      {product.isOnSale && product.originalPrice > product.price ? (
                        <div className='price-block'>
                          <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: 14, marginRight: 8 }}>
                            PKR {product.originalPrice}
                          </span>
                          <span className='price' style={{ color: '#ef4444', fontWeight: 700 }}>
                            PKR {product.price}
                          </span>
                          <span className='sale-badge' style={{ marginLeft: 8, background: '#ef4444', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                            SALE
                          </span>
                        </div>
                      ) : (
                        <p className='price'>PKR {product.price}</p>
                      )}
                    </div>
                    <div className='item-customize'>
                      <Input
                        type={'number'}
                        error={shopFormErrors['quantity']}
                        label={'Quantity'}
                        name={'quantity'}
                        decimals={false}
                        min={1}
                        max={product.inventory}
                        placeholder={'Product Quantity'}
                        disabled={
                          product.inventory <= 0 && !shopFormErrors['quantity']
                        }
                        value={productShopData?.quantity || 1}
                        onInputChange={(name, value) => {
                          productShopChange(name, value);
                        }}
                      />
                    </div>
                    <div className='my-4 item-share'>
                      <SocialShare product={product} />
                    </div>
                    <div className='item-actions'>
                      {itemInCart ? (
                        <Button
                          variant='primary'
                          disabled={
                            product.inventory <= 0 &&
                            !shopFormErrors['quantity']
                          }
                          text='Remove From Bag'
                          className='bag-btn'
                          icon={<BagIcon />}
                          onClick={() => handleRemoveFromCart(product)}
                        />
                      ) : (
                        <Button
                          variant='primary'
                          disabled={
                            product.inventory <= 0 && !shopFormErrors['quantity']
                          }
                          text='Add To Bag'
                          className='bag-btn'
                          icon={<BagIcon />}
                          onClick={() => {
                            trackAddToCart(product, productShopData?.quantity || 1);
                            handleAddToCart(product);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <ProductReviews
              reviewFormData={reviewFormData}
              reviewFormErrors={reviewFormErrors}
              reviews={reviews}
              reviewsSummary={reviewsSummary}
              reviewChange={reviewChange}
              addReview={addProductReview}
            />
          </>
        ) : (
          <NotFound message='No product found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const itemInCart = state.cart.cartItems.find(
    item => item._id === state.product.storeProduct._id
  )
    ? true
    : false;

  return {
    product: state.product.storeProduct,
    productShopData: state.product.productShopData,
    shopFormErrors: state.product.shopFormErrors,
    isLoading: state.product.isLoading,
    reviews: state.review.productReviews,
    reviewsSummary: state.review.reviewsSummary,
    reviewFormData: state.review.reviewFormData,
    reviewFormErrors: state.review.reviewFormErrors,
    itemInCart,
    cartItems: state.cart.cartItems,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(ProductPage);

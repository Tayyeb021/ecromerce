/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';
import { getProductImageUrl } from '../../../utils/image';

const ProductList = props => {
  const { products, updateWishlist, authenticated } = props;

  return (
    <div className='product-list'>
      {products.map((product, index) => (
        <div key={index} className='mb-3 mb-md-0'>
          <div className='product-container'>
            <div className='item-box'>
              <div className='product-actions-overlay'>
                <div className='add-wishlist-box'>
                  <AddToWishList
                    id={product._id}
                    liked={product?.isLiked ?? false}
                    enabled={authenticated}
                    updateWishlist={updateWishlist}
                    authenticated={authenticated}
                  />
                </div>
              </div>

              <div className='item-link'>
                <Link
                  to={`/product/${product.slug}`}
                  className='d-flex flex-column h-100'
                >
                  <div className='item-image-container'>
                    <div className='item-image-box'>
                      <img
                        className='item-image'
                        src={(() => {
                          const imageUrl = getProductImageUrl(product);
                          return Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
                        })()}
                      />
                    </div>
                  </div>
                  <div className='item-body'>
                    <div className='item-details p-3'>
                      <h1 className='item-name'>{product.name}</h1>
                      {product.brand && Object.keys(product.brand).length > 0 && (
                        <p className='by'>
                          By <span>{product.brand.name}</span>
                        </p>
                      )}
                      <p className='item-desc mb-0'>{product.description}</p>
                    </div>
                  </div>
                  <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                    <div className='price-wrapper'>
                      <span className='price-currency'>PKR</span>
                      <span className='price'>{product.price}</span>
                    </div>
                    {product.totalReviews > 0 && (
                      <div className='rating-wrapper'>
                        <span className='rating-value'>
                          {parseFloat(product?.averageRating).toFixed(1)}
                        </span>
                        <span
                          className={`fa fa-star rating-star ${
                            product.totalReviews !== 0 ? 'checked' : ''
                          }`}
                        ></span>
                        <span className='rating-count'>({product.totalReviews})</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

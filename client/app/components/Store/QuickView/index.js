/**
 *
 * Quick View Modal Component
 *
 */

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import Button from '../../Common/Button';
import Input from '../../Common/Input';
import { BagIcon } from '../../Common/Icon';
import ProductImageGallery from '../ProductImageGallery';
import { getImageUrl } from '../../../utils/image';

const QuickView = ({ isOpen, toggle, product, onAddToCart, itemInCart, onRemoveFromCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      // Fallback: redirect to product page
      window.location.href = `/product/${product.slug}`;
    }
    toggle();
  };

  const handleRemoveFromCart = () => {
    if (onRemoveFromCart) {
      onRemoveFromCart(product);
    }
    toggle();
  };

  const images =
    product.images && product.images.length > 0
      ? product.images.map(img => {
        const url = typeof img === 'string' ? img : (img.imageUrl || img);
        return getImageUrl(url);
      })
      : product.imageUrl
        ? [getImageUrl(product.imageUrl)]
        : ['/images/placeholder-image.png'];

  return (
    <Modal isOpen={isOpen} toggle={toggle} className='quick-view-modal' size='lg'>
      <ModalBody>
        <button className='close-quick-view' onClick={toggle}>
          <i className='fa fa-times' />
        </button>
        <Row>
          <Col xs='12' md='6'>
            <ProductImageGallery images={images} productName={product.name} />
          </Col>
          <Col xs='12' md='6'>
            <div className='quick-view-content'>
              <h2 className='product-name'>{product.name}</h2>
              {product.brand && (
                <p className='product-brand'>
                  By <Link to={`/shop/brand/${product.brand.slug}`}>{product.brand.name}</Link>
                </p>
              )}
              <p className='product-price'>PKR {product.price}</p>
              <p className='product-description'>{product.description}</p>

              {product.inventory > 0 && (
                <div className='quick-view-actions'>
                  <Input
                    type='number'
                    label='Quantity'
                    name='quantity'
                    min={1}
                    max={product.inventory}
                    value={quantity}
                    onInputChange={(name, value) => setQuantity(parseInt(value) || 1)}
                  />

                  {itemInCart ? (
                    <Button
                      variant='primary'
                      text='Remove From Cart'
                      icon={<BagIcon />}
                      onClick={handleRemoveFromCart}
                      className='w-100 mt-3'
                    />
                  ) : (
                    <Button
                      variant='primary'
                      text='Add To Cart'
                      icon={<BagIcon />}
                      onClick={handleAddToCart}
                      className='w-100 mt-3'
                    />
                  )}

                  <Link to={`/product/${product.slug}`} className='view-full-link'>
                    View Full Details
                  </Link>
                </div>
              )}

              {product.inventory <= 0 && (
                <p className='out-of-stock-message'>Out of Stock</p>
              )}
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default QuickView;

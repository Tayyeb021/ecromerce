/**
 *
 * CartSummary
 *
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';

const CartSummary = props => {
  const {
    cartTotal,
    shippingOptions,
    selectedShippingOption,
    fetchShippingOptions,
    setSelectedShippingOption,
    coupon,
    discount = 0,
    onApplyCoupon,
    onRemoveCoupon
  } = props;

  const [couponInput, setCouponInput] = useState('');

  useEffect(() => {
    if (shippingOptions.length === 0) fetchShippingOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DEFAULT_SHIPPING_COST = 200;

  const calculateShippingCost = () => {
    if (!selectedShippingOption) return DEFAULT_SHIPPING_COST;
    const opt = selectedShippingOption;
    if (opt.freeShippingThreshold && cartTotal >= opt.freeShippingThreshold) return 0;
    return opt.cost || DEFAULT_SHIPPING_COST;
  };

  const shippingCost = calculateShippingCost();
  const finalTotal = Math.max(0, cartTotal + shippingCost - discount);

  const handleShippingChange = e => {
    const opt = shippingOptions.find(o => o._id === e.target.value);
    if (opt) setSelectedShippingOption(opt);
  };

  const handleApplyCoupon = () => {
    if (couponInput.trim() && onApplyCoupon) onApplyCoupon(couponInput.trim());
  };

  return (
    <div className='cart-summary'>
      <Container>
        {shippingOptions.length > 0 ? (
          <Row className='mb-2 summary-item'>
            <Col xs='12'>
              <label className='summary-label' style={{ display: 'block', marginBottom: 6 }}>
                Shipping Method
              </label>
              <select
                className='form-control'
                value={selectedShippingOption?._id || ''}
                onChange={handleShippingChange}
                style={{ fontSize: 14 }}
              >
                {shippingOptions.map(opt => (
                  <option key={opt._id} value={opt._id}>
                    {opt.name}
                    {opt.deliveryTime ? ` - ${opt.deliveryTime}` : ''}
                    {opt.freeShippingThreshold && cartTotal >= opt.freeShippingThreshold
                      ? ' (Free)'
                      : ` - PKR ${opt.cost.toFixed(2)}`}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        ) : (
          <Row className='mb-2 summary-item'>
            <Col xs='12'>
              <p className='summary-label' style={{ fontSize: 12, color: '#666' }}>
                Standard Shipping (PKR {DEFAULT_SHIPPING_COST})
              </p>
            </Col>
          </Row>
        )}

        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Shipping</p>
            {selectedShippingOption?.deliveryTime && (
              <small className='d-block text-muted' style={{ fontSize: 11 }}>
                {selectedShippingOption.deliveryTime}
              </small>
            )}
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>
              {shippingCost === 0 ? 'Free' : `PKR ${shippingCost.toFixed(2)}`}
            </p>
          </Col>
        </Row>

        {selectedShippingOption?.freeShippingThreshold &&
          cartTotal < selectedShippingOption.freeShippingThreshold && (
          <Row className='mb-1'>
            <Col xs='12'>
              <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                Add PKR {(selectedShippingOption.freeShippingThreshold - cartTotal).toFixed(2)} more for free shipping!
              </p>
            </Col>
          </Row>
        )}

        {/* Coupon */}
        <Row className='mt-2 mb-2'>
          <Col xs='12'>
            {coupon ? (
              <div className='coupon-applied'>
                <span className='coupon-badge'>
                  <i className='fa fa-tag mr-1' />
                  {coupon.code}
                  {coupon.type === 'percentage'
                    ? ` (${coupon.value}% off)`
                    : ` (PKR ${coupon.value} off)`}
                </span>
                <button className='coupon-remove-btn' onClick={onRemoveCoupon}>
                  <i className='fa fa-times' />
                </button>
              </div>
            ) : (
              <div className='coupon-input-wrap'>
                <input
                  type='text'
                  className='form-control coupon-input'
                  placeholder='Coupon code'
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  className='btn btn-sm btn-outline-primary coupon-apply-btn'
                  onClick={handleApplyCoupon}
                  disabled={!couponInput.trim()}
                >
                  Apply
                </button>
              </div>
            )}
          </Col>
        </Row>

        {discount > 0 && (
          <Row className='mb-2 summary-item'>
            <Col xs='9'>
              <p className='summary-label' style={{ color: '#10b981' }}>Discount</p>
            </Col>
            <Col xs='3' className='text-right'>
              <p className='summary-value' style={{ color: '#10b981' }}>
                - PKR {discount.toFixed(2)}
              </p>
            </Col>
          </Row>
        )}

        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'><strong>Total</strong></p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'><strong>PKR {finalTotal.toFixed(2)}</strong></p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartSummary;

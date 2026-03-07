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
    setSelectedShippingOption
  } = props;

  useEffect(() => {
    // Always try to fetch shipping options when component mounts
    if (shippingOptions.length === 0) {
      console.log('Fetching shipping options...');
      fetchShippingOptions();
    } else {
      console.log('Shipping options already loaded:', shippingOptions.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log when shipping options change
  useEffect(() => {
    if (shippingOptions.length > 0) {
      console.log('Shipping options loaded:', shippingOptions);
    }
  }, [shippingOptions]);

  // Log when selected option changes
  useEffect(() => {
    if (selectedShippingOption) {
      console.log('Selected shipping option:', selectedShippingOption);
    }
  }, [selectedShippingOption]);

  // Calculate shipping cost
  const calculateShippingCost = () => {
    // Default shipping cost if no option selected
    const DEFAULT_SHIPPING_COST = 200;

    if (!selectedShippingOption) {
      // Always use default shipping cost of 200 if no option is selected
      return DEFAULT_SHIPPING_COST;
    }

    const option = selectedShippingOption;
    
    // Check if free shipping threshold is met
    if (option.freeShippingThreshold && cartTotal >= option.freeShippingThreshold) {
      return 0;
    }

    return option.cost || DEFAULT_SHIPPING_COST;
  };

  const shippingCost = calculateShippingCost();
  const finalTotal = cartTotal + shippingCost;

  const handleShippingChange = (e) => {
    const selectedId = e.target.value;
    const option = shippingOptions.find(opt => opt._id === selectedId);
    if (option) {
      setSelectedShippingOption(option);
    }
  };

  // Show shipping options dropdown if available, otherwise show default
  const showShippingSelector = shippingOptions.length > 0;
  const DEFAULT_SHIPPING_COST = 200;

  return (
    <div className='cart-summary'>
      <Container>
        {showShippingSelector ? (
          <Row className='mb-2 summary-item'>
            <Col xs='12'>
              <label className='summary-label' style={{ display: 'block', marginBottom: '8px' }}>
                Shipping Method
              </label>
              <select
                className='form-control'
                value={selectedShippingOption?._id || ''}
                onChange={handleShippingChange}
                style={{ fontSize: '14px' }}
              >
                {shippingOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                    {option.deliveryTime && ` - ${option.deliveryTime}`}
                    {option.freeShippingThreshold && cartTotal >= option.freeShippingThreshold
                      ? ' (Free)'
                      : ` - PKR ${option.cost.toFixed(2)}`}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        ) : (
          <Row className='mb-2 summary-item'>
            <Col xs='12'>
              <p className='summary-label' style={{ fontSize: '12px', color: '#666' }}>
                Standard Shipping (PKR {DEFAULT_SHIPPING_COST})
              </p>
            </Col>
          </Row>
        )}
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Shipping</p>
            {selectedShippingOption && selectedShippingOption.deliveryTime && (
              <small className='d-block text-muted' style={{ fontSize: '11px' }}>
                {selectedShippingOption.deliveryTime}
              </small>
            )}
            {!selectedShippingOption && !showShippingSelector && (
              <small className='d-block text-muted' style={{ fontSize: '11px' }}>
                Standard delivery
              </small>
            )}
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>
              {shippingCost === 0 ? 'Free' : `PKR ${shippingCost.toFixed(2)}`}
            </p>
          </Col>
        </Row>
        {selectedShippingOption && 
         selectedShippingOption.freeShippingThreshold && 
         cartTotal < selectedShippingOption.freeShippingThreshold && (
          <Row className='mb-2 summary-item'>
            <Col xs='12'>
              <p className='summary-note' style={{ fontSize: '12px', color: '#666' }}>
                Add PKR {(selectedShippingOption.freeShippingThreshold - cartTotal).toFixed(2)} more for free shipping!
              </p>
            </Col>
          </Row>
        )}
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Total</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>PKR {finalTotal.toFixed(2)}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartSummary;

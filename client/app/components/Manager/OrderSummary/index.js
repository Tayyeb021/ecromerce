/**
 *
 * OrderSummary
 *
 */

import React from 'react';

import { Col } from 'reactstrap';

const OrderSummary = props => {
  const { order } = props;

  return (
    <Col className='order-summary pt-3'>
      <h2>Order Summary</h2>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Subtotal</p>
        <p className='summary-value ml-auto'>
          PKR {(() => {
            // Order total includes shipping, so subtract shipping to get product subtotal
            const orderTotal = order.total || 0;
            const shippingCost = order.shippingOption && order.shippingOption.cost !== undefined
              ? parseFloat(order.shippingOption.cost) 
              : 0;
            const subtotal = orderTotal - shippingCost;
            return subtotal > 0 ? subtotal.toFixed(2) : '0.00';
          })()}
        </p>
      </div>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Est. Sales Tax</p>
        <p className='summary-value ml-auto'>PKR {order.totalTax ? order.totalTax.toFixed(2) : '0.00'}</p>
      </div>

      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>
          Shipping & Handling
          {order.shippingOption && order.shippingOption.name && (
            <small className='d-block text-muted' style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>
              {order.shippingOption.name}
              {order.shippingOption.deliveryTime && ` - ${order.shippingOption.deliveryTime}`}
            </small>
          )}
        </p>
        <p className='summary-value ml-auto'>
          PKR {order.shippingOption && order.shippingOption.cost !== undefined 
            ? order.shippingOption.cost.toFixed(2) 
            : '0.00'}
        </p>
      </div>

      <hr />
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Total</p>
        <p className='summary-value ml-auto'>PKR {order.totalWithTax ? order.totalWithTax.toFixed(2) : '0.00'}</p>
      </div>
    </Col>
  );
};

export default OrderSummary;

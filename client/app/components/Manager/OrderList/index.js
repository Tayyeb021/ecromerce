/**
 *
 * OrderList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '../../../utils/date';
import { getImageUrl } from '../../../utils/image';
import { getStatusColor, getStatusBgColor, getStatusTextColor } from '../../../utils/orderStatus';

const OrderList = props => {
  const { orders } = props;

  const renderFirstItem = order => {
    if (order.products) {
      const product = order.products[0].product;
      return (
        <img
          className='item-image'
          src={getImageUrl(product?.imageUrl)}
        />
      );
    } else {
      return <img className='item-image' src='/images/placeholder-image.png' />;
    }
  };

  return (
    <div className='order-list'>
      {orders.map((order, index) => (
        <div key={index} className='order-box'>
          <Link to={`/order/${order._id}`} className='d-block box-link'>
            <div className='d-flex flex-column flex-lg-row mb-3'>
              <div className='order-first-item p-lg-3'>
                {renderFirstItem(order)}
              </div>
              <div className='d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3'>
                <div className='order-details'>
                  <div className='mb-1'>
                    <span>Status</span>
                    {order?.products ? (
                      <span 
                        className='order-label order-status' 
                        style={{
                          backgroundColor: getStatusBgColor(order?.products[0].status),
                          color: getStatusTextColor(order?.products[0].status),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500',
                          display: 'inline-block',
                          marginLeft: '8px'
                        }}
                      >
                        {order?.products[0].status}
                      </span>
                    ) : (
                      <span className='order-label order-status'>{` Unavailable`}</span>
                    )}
                  </div>
                  <div className='mb-1'>
                    <span>Order #</span>
                    <span className='order-label'>{` ${order._id}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>Ordered on</span>
                    <span className='order-label'>{` ${formatDate(
                      order.created
                    )}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>Order Total</span>
                    <span className='order-label'>{` PKR ${
                      order?.totalWithTax ? order?.totalWithTax.toFixed(2) : '0.00'
                    }`}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OrderList;

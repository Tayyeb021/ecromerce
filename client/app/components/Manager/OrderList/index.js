/**
 *
 * OrderList - Admin inline status management
 *
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/date';
import { getImageUrl } from '../../../utils/image';
import { ROLES } from '../../../constants';

const STATUSES = ['Not_processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors = {
  Not_processed: { bg: '#f1f5f9', text: '#64748b' },
  Processing:    { bg: '#fef3c7', text: '#92400e' },
  Shipped:       { bg: '#dbeafe', text: '#1e40af' },
  Delivered:     { bg: '#d1fae5', text: '#065f46' },
  Cancelled:     { bg: '#fee2e2', text: '#991b1b' }
};

const StatusBadge = ({ status }) => {
  const colors = statusColors[status] || { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        padding: '3px 10px',
        borderRadius: '20px',
        fontWeight: 600,
        fontSize: 12,
        display: 'inline-block'
      }}
    >
      {status}
    </span>
  );
};

const OrderList = ({ orders, user, onStatusChange }) => {
  const isAdmin = user && user.role === ROLES.Admin;

  const renderFirstItemImage = order => {
    if (order.products && order.products[0]) {
      const product = order.products[0].product;
      return (
        <img
          className='item-image'
          src={getImageUrl(product?.imageUrl)}
          alt='product'
          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
        />
      );
    }
    return (
      <img
        className='item-image'
        src='/images/placeholder-image.png'
        alt='product'
        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
      />
    );
  };

  return (
    <div className='admin-order-list'>
      {orders.map((order, oi) => (
        <div key={oi} className='admin-order-card'>
          {/* Order Header */}
          <div className='admin-order-header'>
            <div className='d-flex align-items-center gap-2' style={{ gap: 10 }}>
              {renderFirstItemImage(order)}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                  Order #{order._id?.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {formatDate(order.created)}
                </div>
              </div>
            </div>
            <div className='d-flex align-items-center' style={{ gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#2962ff', fontSize: 14 }}>
                  PKR {order.totalWithTax ? order.totalWithTax.toFixed(2) : '0.00'}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {order.user?.email || order.guestEmail || 'Guest'}
                </div>
              </div>
              <Link
                to={`/order/${order._id}`}
                className='btn btn-sm btn-outline-primary'
                style={{ whiteSpace: 'nowrap', fontSize: 12 }}
              >
                <i className='fa fa-eye mr-1' /> Details
              </Link>
            </div>
          </div>

          {/* Order Items */}
          <div className='admin-order-items'>
            {order.products && order.products.map((item, ii) => (
              <div key={ii} className='admin-order-item-row'>
                <div className='order-item-info'>
                  <span className='order-item-name'>
                    {item.product?.name || item.name || 'Product'}
                  </span>
                  <span className='order-item-qty'>Qty: {item.quantity || 1}</span>
                  <span className='order-item-price'>
                    PKR {((item.purchasePrice || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                  <StatusBadge status={item.status} />
                </div>

                {isAdmin && onStatusChange && (
                  <div className='order-status-actions'>
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        className={`btn btn-xs status-btn ${item.status === s ? 'active' : ''}`}
                        style={{
                          background: item.status === s ? statusColors[s]?.bg : 'transparent',
                          color: item.status === s ? statusColors[s]?.text : '#64748b',
                          border: `1px solid ${item.status === s ? statusColors[s]?.text : '#e2e8f0'}`,
                          borderRadius: 6,
                          padding: '2px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          fontWeight: item.status === s ? 700 : 400
                        }}
                        onClick={() =>
                          s !== item.status &&
                          onStatusChange(order._id, order.cartId, item._id, s)
                        }
                        disabled={item.status === s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;

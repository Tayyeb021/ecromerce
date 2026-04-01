/**
 *
 * AdminOrderTable
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '../../../utils/date';
import {
  getStatusBgColor,
  getStatusTextColor
} from '../../../utils/orderStatus';

const AdminOrderTable = props => {
  const { orders } = props;

  return (
    <div className='admin-orders-table table-responsive'>
      <table className='table mb-0'>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th className='text-right'>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const status = order.primaryStatus || order?.products?.[0]?.status || 'Unavailable';
            const total = order?.totalWithTax ?? order?.total ?? 0;
            const itemCount =
              order.itemCount != null
                ? order.itemCount
                : Array.isArray(order.products)
                  ? order.products.reduce((sum, item) => sum + (item.quantity || 0), 0)
                  : 0;

            return (
              <tr key={order._id}>
                <td>
                  <div className='admin-orders-table__primary'>
                    <span className='admin-orders-table__label'>#{order._id}</span>
                  </div>
                </td>
                <td>
                  <div className='admin-orders-table__customer'>
                    <span className='admin-orders-table__name'>
                      {order.customerName || 'Guest customer'}
                    </span>
                    <span className='admin-orders-table__muted'>
                      {order.customerEmail || 'No email available'}
                    </span>
                  </div>
                </td>
                <td>{itemCount}</td>
                <td>
                  <span
                    className='admin-orders-table__status'
                    style={{
                      backgroundColor: getStatusBgColor(status),
                      color: getStatusTextColor(status)
                    }}
                  >
                    {status}
                  </span>
                </td>
                <td>PKR {Number(total).toFixed(2)}</td>
                <td>{formatDate(order.created)}</td>
                <td className='text-right'>
                  <Link
                    to={`/order/${order._id}`}
                    className='admin-orders-table__action'
                  >
                    View details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;

/**
 * Order status color utility
 */

import { CART_ITEM_STATUS } from '../constants';

export const getStatusColor = (status) => {
  if (!status) return '#6c757d'; // gray default

  const statusColors = {
    [CART_ITEM_STATUS.Processing]: '#007bff', // blue
    [CART_ITEM_STATUS.Shipped]: '#17a2b8', // cyan
    [CART_ITEM_STATUS.Delivered]: '#28a745', // green
    [CART_ITEM_STATUS.Cancelled]: '#dc3545', // red
    [CART_ITEM_STATUS.Not_processed]: '#ffc107' // yellow
  };

  return statusColors[status] || '#6c757d';
};

export const getStatusBgColor = (status) => {
  if (!status) return '#e9ecef'; // light gray default

  const statusBgColors = {
    [CART_ITEM_STATUS.Processing]: '#cfe2ff', // light blue
    [CART_ITEM_STATUS.Shipped]: '#cff4fc', // light cyan
    [CART_ITEM_STATUS.Delivered]: '#d1e7dd', // light green
    [CART_ITEM_STATUS.Cancelled]: '#f8d7da', // light red
    [CART_ITEM_STATUS.Not_processed]: '#fff3cd' // light yellow
  };

  return statusBgColors[status] || '#e9ecef';
};

export const getStatusTextColor = (status) => {
  if (!status) return '#495057'; // dark gray default

  const statusTextColors = {
    [CART_ITEM_STATUS.Processing]: '#004085', // dark blue
    [CART_ITEM_STATUS.Shipped]: '#055160', // dark cyan
    [CART_ITEM_STATUS.Delivered]: '#0f5132', // dark green
    [CART_ITEM_STATUS.Cancelled]: '#842029', // dark red
    [CART_ITEM_STATUS.Not_processed]: '#664d03' // dark yellow
  };

  return statusTextColors[status] || '#495057';
};

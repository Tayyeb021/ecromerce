// API_URL - base API URL (no trailing slash). Trimmed so .env spaces don't break requests.
const rawApiUrl = process.env.API_URL || 'https://a-z-on-buz.com/api';
export const API_URL = typeof rawApiUrl === 'string' ? rawApiUrl.trim().replace(/\/+$/, '') : rawApiUrl;

export const SOCKET_URL =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://ecromerce-production.up.railway.app'
    : window.location.host;

export const ROLES = {
  Admin: 'ROLE ADMIN',
  Member: 'ROLE MEMBER',
  Merchant: 'ROLE MERCHANT'
};

export const CART_ITEMS = 'cart_items';
export const CART_TOTAL = 'cart_total';
export const CART_ID = 'cart_id';

export const CART_ITEM_STATUS = {
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Not_processed: 'Not processed'
};

export const MERCHANT_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const REVIEW_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const EMAIL_PROVIDER = {
  Email: 'Email',
  Google: 'Google',
  Facebook: 'Facebook'
};

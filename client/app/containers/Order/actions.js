/*
 *
 * Order actions
 *
 */

import { push } from 'connected-react-router';
import axios from 'axios';
import { success } from 'react-notification-system-redux';

import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS,
  SET_PLACING_ORDER
} from './constants';

import { clearCart, getCartId } from '../Cart/actions';
import handleError from '../../utils/error';
import { API_URL, CART_ID } from '../../constants';

export const updateOrderStatus = value => {
  return {
    type: UPDATE_ORDER_STATUS,
    payload: value
  };
};

export const setOrderLoading = value => {
  return {
    type: SET_ORDERS_LOADING,
    payload: value
  };
};

export const fetchOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchAccountOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order/me`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const searchOrders = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order/search`, {
        params: {
          search: filter.value
        }
      });

      dispatch({
        type: FETCH_SEARCHED_ORDERS,
        payload: response.data.orders
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrder = (id, withLoading = true) => {
  return async (dispatch, getState) => {
    try {
      if (withLoading) {
        dispatch(setOrderLoading(true));
      }

      const response = await axios.get(`${API_URL}/order/${id}`);

      dispatch({
        type: FETCH_ORDER,
        payload: response.data.order
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      if (withLoading) {
        dispatch(setOrderLoading(false));
      }
    }
  };
};

export const cancelOrder = () => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      await axios.delete(`${API_URL}/order/cancel/${order._id}`);

      dispatch(push(`/dashboard/orders`));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const updateOrderItemStatus = (itemId, status) => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      const response = await axios.put(
        `${API_URL}/order/status/item/${itemId}`,
        {
          orderId: order._id,
          cartId: order.cartId,
          status
        }
      );

      if (response.data.orderCancelled) {
        dispatch(push(`/dashboard/orders`));
      } else {
        dispatch(updateOrderStatus({ itemId, status }));
        dispatch(fetchOrder(order._id, false));
      }

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const addOrder = (customerInfo = {}) => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_PLACING_ORDER, payload: true });
    try {
      const cartId = localStorage.getItem(CART_ID);
      const cartState = getState().cart;
      const cartTotal = cartState.cartTotal; // Product total only
      const selectedShippingOption = cartState.selectedShippingOption;

      // Calculate shipping cost
      const DEFAULT_SHIPPING_COST = 200;
      let shippingCost = DEFAULT_SHIPPING_COST; // Default to 200 if no option
      
      if (selectedShippingOption) {
        if (selectedShippingOption.freeShippingThreshold && 
            cartTotal >= selectedShippingOption.freeShippingThreshold) {
          shippingCost = 0;
        } else {
          shippingCost = selectedShippingOption.cost || DEFAULT_SHIPPING_COST;
        }
      }

      // Total includes products + shipping (tax will be calculated on backend)
      const orderTotal = cartTotal + shippingCost;

      const orderData = {
        cartId,
        total: orderTotal, // Total with shipping (tax calculated separately on backend)
        shippingOption: selectedShippingOption ? {
          name: selectedShippingOption.name,
          cost: shippingCost,
          deliveryTime: selectedShippingOption.deliveryTime
        } : {
          name: 'Standard Shipping',
          cost: shippingCost,
          deliveryTime: '5-7 business days'
        },
        ...customerInfo
      };

      if (cartId) {
        const response = await axios.post(`${API_URL}/order/add`, orderData);

        dispatch(push(`/order/success/${response.data.order._id}`));
        dispatch(clearCart());
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_PLACING_ORDER, payload: false });
    }
  };
};

export const placeOrder = (customerInfo) => {
  return (dispatch, getState) => {
    const token = localStorage.getItem('token');

    const cartItems = getState().cart.cartItems;

    if (token && cartItems.length > 0) {
      Promise.all([dispatch(getCartId())]).then(() => {
        dispatch(addOrder(customerInfo));
      });
    }
  };
};

// Guest checkout: place order with email and optional address/phone (no account)
export const placeGuestOrder = (guestData) => {
  return async (dispatch, getState) => {
    const { email, firstName, lastName, address, phone } = guestData || {};
    const cartState = getState().cart;
    const cartItems = cartState.cartItems;
    const cartTotal = cartState.cartTotal;
    const selectedShippingOption = cartState.selectedShippingOption;

    if (!email || !cartItems || cartItems.length === 0) return;

    const products = cartItems.map((item) => ({
      product: item._id,
      quantity: item.quantity,
      price: item.price,
      taxable: item.taxable
    }));

    const DEFAULT_SHIPPING_COST = 200;
    let shippingCost = DEFAULT_SHIPPING_COST;
    if (selectedShippingOption) {
      if (selectedShippingOption.freeShippingThreshold && cartTotal >= selectedShippingOption.freeShippingThreshold) {
        shippingCost = 0;
      } else {
        shippingCost = selectedShippingOption.cost || DEFAULT_SHIPPING_COST;
      }
    }
    const total = cartTotal + shippingCost;
    const shippingOption = selectedShippingOption ? {
      name: selectedShippingOption.name,
      cost: shippingCost,
      deliveryTime: selectedShippingOption.deliveryTime
    } : {
      name: 'Standard Shipping',
      cost: shippingCost,
      deliveryTime: '5-7 business days'
    };

    dispatch({ type: SET_PLACING_ORDER, payload: true });
    try {
      const guestOrderUrl = `${API_URL.replace(/\/+$/, '')}/order/guest`;
      const response = await axios.post(guestOrderUrl, {
        email: email.trim(),
        firstName: firstName ? firstName.trim() : '',
        lastName: lastName ? lastName.trim() : '',
        address: address ? String(address).trim() : '',
        phone: phone ? String(phone).trim() : '',
        products,
        total,
        shippingOption
      });
      dispatch(push(`/order/success/${response.data.order._id}`));
      dispatch(clearCart());
    } catch (error) {
      if (error.response && error.response.status === 404) {
        handleError(
          { ...error, response: { ...error.response, data: { error: 'Guest checkout not available. Deploy the latest backend (POST /api/order/guest).' } } },
          dispatch,
          'Place order failed'
        );
      } else {
        handleError(error, dispatch);
      }
    } finally {
      dispatch({ type: SET_PLACING_ORDER, payload: false });
    }
  };
};

export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};

import axios from 'axios';
import { success } from 'react-notification-system-redux';

import {
  FETCH_SHIPPING_OPTIONS,
  FETCH_SHIPPING_OPTION,
  ADD_SHIPPING_OPTION,
  UPDATE_SHIPPING_OPTION,
  DELETE_SHIPPING_OPTION,
  SET_SHIPPING_OPTIONS_LOADING,
  SET_SHIPPING_FORM_ERRORS,
  RESET_SHIPPING_FORM
} from './constants';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';

export const setShippingLoading = value => {
  return {
    type: SET_SHIPPING_OPTIONS_LOADING,
    payload: value
  };
};

export const fetchShippingOptions = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setShippingLoading(true));

      const response = await axios.get(`${API_URL}/shipping/`);

      dispatch({
        type: FETCH_SHIPPING_OPTIONS,
        payload: response.data.shippingOptions
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setShippingLoading(false));
    }
  };
};

export const fetchShippingOption = id => {
  return async (dispatch, getState) => {
    try {
      dispatch(setShippingLoading(true));

      const response = await axios.get(`${API_URL}/shipping/${id}`);

      dispatch({
        type: FETCH_SHIPPING_OPTION,
        payload: response.data.shippingOption
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setShippingLoading(false));
    }
  };
};

export const addShippingOption = () => {
  return async (dispatch, getState) => {
    try {
      const shippingFormData = getState().shipping.shippingFormData;

      const response = await axios.post(`${API_URL}/shipping/add`, shippingFormData);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: ADD_SHIPPING_OPTION,
          payload: response.data.shippingOption
        });
        dispatch({ type: RESET_SHIPPING_FORM });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const updateShippingOption = id => {
  return async (dispatch, getState) => {
    try {
      const shippingFormData = getState().shipping.shippingFormData;

      const response = await axios.put(`${API_URL}/shipping/${id}`, shippingFormData);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: UPDATE_SHIPPING_OPTION,
          payload: response.data.shippingOption
        });
        dispatch({ type: RESET_SHIPPING_FORM });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const deleteShippingOption = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`${API_URL}/shipping/delete/${id}`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: DELETE_SHIPPING_OPTION,
          payload: id
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const shippingChange = (name, value) => {
  return {
    type: 'SHIPPING_FORM_CHANGE',
    payload: { name, value }
  };
};

export const resetShippingForm = () => {
  return {
    type: RESET_SHIPPING_FORM
  };
};

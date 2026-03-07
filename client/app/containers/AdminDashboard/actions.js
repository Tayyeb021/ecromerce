/*
 *
 * AdminDashboard actions
 *
 */

import axios from 'axios';

import {
  FETCH_CURRENT_MONTH_SALES,
  SET_SALES_LOADING
} from './constants';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';

export const setSalesLoading = value => {
  return {
    type: SET_SALES_LOADING,
    payload: value
  };
};

export const fetchCurrentMonthSales = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSalesLoading(true));

      const response = await axios.get(`${API_URL}/order/current-month`);

      dispatch({
        type: FETCH_CURRENT_MONTH_SALES,
        payload: response.data
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setSalesLoading(false));
    }
  };
};

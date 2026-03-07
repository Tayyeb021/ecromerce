/*
 *
 * Homepage actions
 *
 */

import axios from 'axios';

import {
  FETCH_BANNERS,
  SET_BANNERS_LOADING
} from './constants';

import handleError from '../../utils/error';
import { API_URL } from '../../constants';

// fetch store banners api
export const fetchStoreBanners = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_BANNERS_LOADING, payload: true });

      const response = await axios.get(`${API_URL}/banner/list`);

      dispatch({
        type: FETCH_BANNERS,
        payload: response.data.banners || []
      });
    } catch (error) {
      // If API fails, use empty array as fallback
      dispatch({
        type: FETCH_BANNERS,
        payload: []
      });
      // Don't show error for banner fetch failure
      // handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_BANNERS_LOADING, payload: false });
    }
  };
};

export const defaultAction = () => {
  return {
    type: 'DEFAULT_ACTION'
  };
};

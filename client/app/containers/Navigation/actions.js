/*
 *
 * Navigation actions
 *
 */

import axios from 'axios';
import handleError from '../../utils/error';
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';
import { API_URL } from '../../constants';

export const toggleMenu = () => {
  return {
    type: TOGGLE_MENU
  };
};

export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

export const toggleBrand = () => {
  return {
    type: TOGGLE_BRAND
  };
};

export const onSearch = v => {
  return {
    type: SEARCH_CHANGE,
    payload: v
  };
};

let searchTimeout = null;

export const onSuggestionsFetchRequested = value => {
  const inputValue = value.value.trim().toLowerCase();

  return async (dispatch, getState) => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search requests
    searchTimeout = setTimeout(async () => {
      try {
        // Search when user types at least 2 characters
        if (inputValue && inputValue.length >= 2) {
          const encodedValue = encodeURIComponent(inputValue);
          const response = await axios.get(
            `${API_URL}/product/list/search/${encodedValue}`
          );
          dispatch({
            type: SUGGESTIONS_FETCH_REQUEST,
            payload: response.data.products || []
          });
        } else {
          // Clear suggestions if input is too short
          dispatch({
            type: SUGGESTIONS_FETCH_REQUEST,
            payload: []
          });
        }
      } catch (error) {
        // On error, clear suggestions
        dispatch({
          type: SUGGESTIONS_FETCH_REQUEST,
          payload: []
        });
        // Only log error, don't show to user for search
        if (error.response?.status !== 404) {
          console.error('Search error:', error);
        }
      }
    }, 300); // 300ms debounce delay
  };
};

export const onSuggestionsClearRequested = () => {
  return {
    type: SUGGESTIONS_CLEAR_REQUEST,
    payload: []
  };
};

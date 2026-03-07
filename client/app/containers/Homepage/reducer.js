/*
 *
 * Homepage reducer
 *
 */

import {
  DEFAULT_ACTION,
  FETCH_BANNERS,
  SET_BANNERS_LOADING
} from './constants';

const initialState = {
  banners: [],
  isLoading: false
};

const homepageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BANNERS:
      return {
        ...state,
        banners: action.payload
      };
    case SET_BANNERS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
};

export default homepageReducer;

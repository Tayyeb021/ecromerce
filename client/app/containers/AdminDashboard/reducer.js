/*
 *
 * AdminDashboard reducer
 *
 */

import {
  FETCH_CURRENT_MONTH_SALES,
  SET_SALES_LOADING
} from './constants';

const initialState = {
  salesData: [],
  totalSales: 0,
  salesCount: 0,
  orders: [],
  isLoading: false
};

const adminDashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CURRENT_MONTH_SALES:
      return {
        ...state,
        salesData: action.payload.salesData || [],
        totalSales: action.payload.totalSales || 0,
        salesCount: action.payload.salesCount || 0,
        orders: action.payload.orders || []
      };
    case SET_SALES_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default adminDashboardReducer;

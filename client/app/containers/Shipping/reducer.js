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

const initialState = {
  shippingOptions: [],
  shippingOption: null,
  shippingFormData: {
    name: '',
    description: '',
    cost: 0,
    deliveryTime: '',
    isActive: true,
    isDefault: false,
    freeShippingThreshold: null,
    sortOrder: 0
  },
  formErrors: {},
  isLoading: false
};

const shippingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SHIPPING_OPTIONS:
      return {
        ...state,
        shippingOptions: action.payload
      };

    case FETCH_SHIPPING_OPTION:
      return {
        ...state,
        shippingOption: action.payload,
        shippingFormData: {
          name: action.payload.name || '',
          description: action.payload.description || '',
          cost: action.payload.cost || 0,
          deliveryTime: action.payload.deliveryTime || '',
          isActive: action.payload.isActive !== undefined ? action.payload.isActive : true,
          isDefault: action.payload.isDefault || false,
          freeShippingThreshold: action.payload.freeShippingThreshold || null,
          sortOrder: action.payload.sortOrder || 0
        }
      };

    case ADD_SHIPPING_OPTION:
      return {
        ...state,
        shippingOptions: [...state.shippingOptions, action.payload]
      };

    case UPDATE_SHIPPING_OPTION:
      return {
        ...state,
        shippingOptions: state.shippingOptions.map(option =>
          option._id === action.payload._id ? action.payload : option
        )
      };

    case DELETE_SHIPPING_OPTION:
      return {
        ...state,
        shippingOptions: state.shippingOptions.filter(
          option => option._id !== action.payload
        )
      };

    case SET_SHIPPING_OPTIONS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case SET_SHIPPING_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };

    case 'SHIPPING_FORM_CHANGE':
      return {
        ...state,
        shippingFormData: {
          ...state.shippingFormData,
          [action.payload.name]: action.payload.value
        }
      };

    case RESET_SHIPPING_FORM:
      return {
        ...state,
        shippingFormData: initialState.shippingFormData,
        shippingOption: null,
        formErrors: {}
      };

    default:
      return state;
  }
};

export default shippingReducer;

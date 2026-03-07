/*
 *
 * Banner reducer
 *
 */

import {
  FETCH_BANNERS,
  FETCH_BANNER,
  BANNER_CHANGE,
  BANNER_EDIT_CHANGE,
  SET_BANNER_FORM_ERRORS,
  SET_BANNER_FORM_EDIT_ERRORS,
  ADD_BANNER,
  REMOVE_BANNER,
  SET_BANNERS_LOADING,
  RESET_BANNER
} from './constants';

const initialState = {
  banners: [],
  banner: {},
  bannerFormData: {
    title: '',
    image: null,
    imageUrl: '',
    imagePreview: '',
    link: '',
    content: '',
    category: '',
    isActive: true,
    order: 0
  },
  bannerFormEditData: {
    title: '',
    image: null,
    imageUrl: '',
    imagePreview: '',
    link: '',
    content: '',
    category: '',
    isActive: true,
    order: 0
  },
  formErrors: {},
  formEditErrors: {},
  isLoading: false
};

const bannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BANNERS:
      return {
        ...state,
        banners: action.payload
      };
    case FETCH_BANNER:
      return {
        ...state,
        banner: action.payload,
        bannerFormEditData: {
          title: action.payload.title || '',
          image: null,
          imageUrl: action.payload.imageUrl || '',
          imagePreview: action.payload.imageUrl || '',
          link: action.payload.link || '',
          content: action.payload.content || '',
          category: action.payload.category ? action.payload.category._id : '',
          isActive: action.payload.isActive !== undefined ? action.payload.isActive : true,
          order: action.payload.order || 0
        }
      };
    case BANNER_CHANGE:
      return {
        ...state,
        bannerFormData: { ...state.bannerFormData, ...action.payload }
      };
    case BANNER_EDIT_CHANGE:
      return {
        ...state,
        bannerFormEditData: { ...state.bannerFormEditData, ...action.payload }
      };
    case SET_BANNER_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_BANNER_FORM_EDIT_ERRORS:
      return {
        ...state,
        formEditErrors: action.payload
      };
    case ADD_BANNER:
      return {
        ...state,
        banners: [...state.banners, action.payload]
      };
    case REMOVE_BANNER:
      return {
        ...state,
        banners: state.banners.filter(banner => banner._id !== action.payload)
      };
    case SET_BANNERS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case RESET_BANNER:
      return {
        ...state,
        bannerFormData: {
          title: '',
          image: null,
          imageUrl: '',
          imagePreview: '',
          link: '',
          content: '',
          category: '',
          isActive: true,
          order: 0
        },
        bannerFormEditData: {
          title: '',
          image: null,
          imageUrl: '',
          imagePreview: '',
          link: '',
          content: '',
          category: '',
          isActive: true,
          order: 0
        },
        formErrors: {},
        formEditErrors: {}
      };
    default:
      return state;
  }
};

export default bannerReducer;

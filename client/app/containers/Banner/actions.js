/*
 *
 * Banner actions
 *
 */

import { goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

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

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

export const bannerChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: BANNER_CHANGE,
    payload: formData
  };
};

export const bannerEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: BANNER_EDIT_CHANGE,
    payload: formData
  };
};

export const fetchBanners = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_BANNERS_LOADING, payload: true });

      const response = await axios.get(`${API_URL}/banner/`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      dispatch({
        type: FETCH_BANNERS,
        payload: response.data.banners
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_BANNERS_LOADING, payload: false });
    }
  };
};

export const fetchBanner = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`${API_URL}/banner/${id}`);

      dispatch({
        type: FETCH_BANNER,
        payload: response.data.banner
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const addBanner = () => {
  return async (dispatch, getState) => {
    try {
      const banner = getState().banner.bannerFormData;
      
      // Validate that either image file or imageUrl is provided
      if (!banner.image && !banner.imageUrl) {
        return dispatch({ 
          type: SET_BANNER_FORM_ERRORS, 
          payload: { image: ['Please upload an image or enter an image URL.'] } 
        });
      }

      let formData;
      let headers = {
        Authorization: localStorage.getItem('token')
      };

      // If image file is uploaded, use FormData
      if (banner.image) {
        formData = new FormData();
        formData.append('image', banner.image);
        formData.append('title', banner.title || '');
        formData.append('link', banner.link || '');
        formData.append('content', banner.content || '');
        formData.append('category', banner.category || '');
        formData.append('isActive', banner.isActive);
        formData.append('order', banner.order || 0);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Otherwise send as JSON
        formData = {
          title: banner.title || '',
          imageUrl: banner.imageUrl,
          link: banner.link || '',
          content: banner.content || '',
          category: banner.category || '',
          isActive: banner.isActive,
          order: banner.order || 0
        };
      }

      const response = await axios.post(
        `${API_URL}/banner/add`,
        formData,
        {
          headers
        }
      );

      const notificationOpts = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 5
      };

      dispatch(success(notificationOpts));
      dispatch({ type: ADD_BANNER, payload: response.data.banner });
      dispatch({ type: RESET_BANNER });
      dispatch(goBack());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const updateBanner = id => {
  return async (dispatch, getState) => {
    try {
      const banner = getState().banner.bannerFormEditData;
      
      // Validate that either image file, imageUrl, or existing image is present
      // (existing image will be preserved if no new image/URL provided)

      let formData;
      let headers = {
        Authorization: localStorage.getItem('token')
      };

      // If image file is uploaded, use FormData
      if (banner.image) {
        formData = new FormData();
        formData.append('image', banner.image);
        formData.append('title', banner.title || '');
        formData.append('link', banner.link || '');
        formData.append('content', banner.content || '');
        formData.append('category', banner.category || '');
        formData.append('isActive', banner.isActive);
        formData.append('order', banner.order || 0);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Otherwise send as JSON (imageUrl or existing image will be used)
        formData = {
          title: banner.title || '',
          imageUrl: banner.imageUrl || '',
          link: banner.link || '',
          content: banner.content || '',
          category: banner.category || '',
          isActive: banner.isActive,
          order: banner.order || 0
        };
      }

      const response = await axios.put(
        `${API_URL}/banner/${id}`,
        formData,
        {
          headers
        }
      );

      const notificationOpts = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 5
      };

      dispatch(success(notificationOpts));
      dispatch({ type: REMOVE_BANNER, payload: id });
      dispatch({ type: RESET_BANNER });
      dispatch(goBack());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const deleteBanner = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`${API_URL}/banner/delete/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      const notificationOpts = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 5
      };

      dispatch(success(notificationOpts));
      dispatch({ type: REMOVE_BANNER, payload: id });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const resetBanner = () => {
  return dispatch => {
    dispatch({
      type: RESET_BANNER
    });
  };
};

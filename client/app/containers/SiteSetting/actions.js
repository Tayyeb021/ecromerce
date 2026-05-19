import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_SITE_SETTINGS,
  SITE_SETTING_CHANGE,
  SET_SITE_SETTINGS_LOADING
} from './constants';

import handleError from '../../utils/error';
import { API_URL } from '../../constants';
import { initPixel } from '../../utils/pixel';

export const siteSettingChange = (name, value) => ({
  type: SITE_SETTING_CHANGE,
  payload: { [name]: value }
});

export const fetchSiteSettings = () => async dispatch => {
  try {
    dispatch({ type: SET_SITE_SETTINGS_LOADING, payload: true });
    const response = await axios.get(`${API_URL}/setting`);
    const settings = response.data.settings || {};
    dispatch({ type: FETCH_SITE_SETTINGS, payload: settings });
    if (settings.pixelId) initPixel(settings.pixelId);
  } catch (error) {
    // silently fail — settings are optional
  } finally {
    dispatch({ type: SET_SITE_SETTINGS_LOADING, payload: false });
  }
};

export const saveSiteSetting = (key) => async (dispatch, getState) => {
  try {
    const value = getState().siteSetting.formData[key];
    const response = await axios.put(
      `${API_URL}/setting`,
      { key, value },
      { headers: { Authorization: localStorage.getItem('token') } }
    );
    dispatch(success({ title: response.data.message, position: 'tr', autoDismiss: 3 }));
    dispatch({ type: FETCH_SITE_SETTINGS, payload: { ...getState().siteSetting.settings, [key]: value } });
    if (key === 'pixelId' && value) initPixel(value);
  } catch (error) {
    handleError(error, dispatch);
  }
};

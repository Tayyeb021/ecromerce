import {
  FETCH_SITE_SETTINGS,
  SITE_SETTING_CHANGE,
  SET_SITE_SETTINGS_LOADING
} from './constants';

const initialState = {
  settings: {},
  formData: { pixelId: '' },
  isLoading: false
};

const siteSettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SITE_SETTINGS:
      return {
        ...state,
        settings: action.payload,
        formData: { pixelId: action.payload.pixelId || '' }
      };
    case SITE_SETTING_CHANGE:
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
    case SET_SITE_SETTINGS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default siteSettingReducer;

/**
 *
 * error.js
 * This is a generic error handler, it receives the error returned from the server and present it on a pop up
 * On 401: only sign out and redirect to login if the user was actually logged in (had a token).
 * Guests (no token) should not be redirected when a public API returns 401 (e.g. shipping list).
 */

import { error } from 'react-notification-system-redux';

import { signOut } from '../containers/Login/actions';

const handleError = (err, dispatch, title = '') => {
  const unsuccessfulOptions = {
    title: `${title}`,
    message: ``,
    position: 'tr',
    autoDismiss: 1
  };

  if (err.response) {
    if (err.response.status === 400) {
      unsuccessfulOptions.title = title ? title : 'Please Try Again!';
      unsuccessfulOptions.message = err.response.data.error;
      dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 404) {
      // unsuccessfulOptions.title =
      //   err.response.data.message ||
      //   'Your request could not be processed. Please try again.';
      // dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 401) {
      const hadToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
      if (hadToken) {
        unsuccessfulOptions.message = 'Unauthorized Access! Please login again';
        dispatch(signOut());
        dispatch(error(unsuccessfulOptions));
      }
      // If guest (no token), do not redirect to login or show sign-out message
    } else if (err.response.status === 403) {
      unsuccessfulOptions.message =
        'Forbidden! You are not allowed to access this resource.';
      dispatch(error(unsuccessfulOptions));
    }
  } else if (err.message) {
    unsuccessfulOptions.message = err.message;
    dispatch(error(unsuccessfulOptions));
  } else {
    // fallback
    unsuccessfulOptions.message =
      'Your request could not be processed. Please try again.';
  }
};

export default handleError;

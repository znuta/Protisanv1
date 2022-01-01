import {HIDE_NOTIFICATION, SHOW_NOTIFICATION} from 'src/redux/action-types';

export const showNotification = (status, message) => {
  return {
    type: SHOW_NOTIFICATION,
    payload: {status, message},
  };
};

export const hideNotification = () => {
  return {
    type: HIDE_NOTIFICATION,
  };
};

import { showMessage } from 'react-native-flash-message'

export * from './user'
export * from './meta'
export * from './products'
export * from './order'
export * from './wishlist'

export const SHOW_ACTIVITY_INDICATOR_ROOT = 'SHOW_ACTIVITY_INDICATOR_ROOT'
export const HIDE_ACTIVITY_INDICATOR_ROOT = 'HIDE_ACTIVITY_INDICATOR_ROOT'

export function rootLoader (request, text) {
  return (dispatch) => {
    if (request) {
      return dispatch({ type: SHOW_ACTIVITY_INDICATOR_ROOT, text: text || '' })
    } else {
      return dispatch({ type: HIDE_ACTIVITY_INDICATOR_ROOT })
    }
  }
}

export function setNotificationToken(token) {
  return (dispatch) => {
    dispatch({ type: "PUSH_NOTIFICATION_TOKEN", payload: token });
  };
}

export function flashMessage(message, description, type, options = {}) {
  showMessage({
    message,
    description,
    type,
    icon: type,
    ...options,
  });
}
import getSymbolFromCurrency from 'currency-symbol-map';
import { getCurrencyRate } from '../../providers/ecency/ecency';
import {
  CHANGE_COMMENT_NOTIFICATION,
  CHANGE_FOLLOW_NOTIFICATION,
  CHANGE_MENTION_NOTIFICATION,
  CHANGE_REBLOG_NOTIFICATION,
  CHANGE_TRANSFERS_NOTIFICATION,
  CHANGE_ALL_NOTIFICATION_SETTINGS,
  CHANGE_VOTE_NOTIFICATION,
  CLOSE_PIN_CODE_MODAL,
  IS_CONNECTED,
  IS_ANALYTICS,
  IS_DARK_THEME,
  IS_DEFAULT_FOOTER,
  IS_LOGIN_DONE,
  IS_NOTIFICATION_OPEN,
  LOGIN,
  LOGOUT_DONE,
  LOGOUT,
  OPEN_PIN_CODE_MODAL,
  SET_API,
  SET_CURRENCY,
  SET_LANGUAGE,
  SET_NSFW,
  SET_UPVOTE_PERCENT,
  SET_PIN_CODE,
  IS_PIN_CODE_OPEN,
  IS_RENDER_REQUIRED,
  SET_LAST_APP_VERSION,
  SET_COLOR_THEME,
  SET_SETTINGS_MIGRATED,
  HIDE_POSTS_THUMBNAILS,
  SET_TERMS_ACCEPTED
} from '../constants/constants';

export const login = (payload) => ({
  payload,
  type: LOGIN,
});

export const logout = () => ({
  type: LOGOUT,
});

export const logoutDone = () => ({
  type: LOGOUT_DONE,
});

export const isLoginDone = () => ({
  type: IS_LOGIN_DONE,
});

export const openPinCodeModal = (payload = null) => ({
  payload,
  type: OPEN_PIN_CODE_MODAL,
});

export const closePinCodeModal = () => ({
  type: CLOSE_PIN_CODE_MODAL,
});


// Settings actions
export const setLanguage = (payload) => ({
  payload,
  type: SET_LANGUAGE,
});

export const setApi = (payload) => ({
  payload,
  type: SET_API,
});

export const setUpvotePercent = (payload) => ({
  payload,
  type: SET_UPVOTE_PERCENT,
});

export const changeAllNotificationSettings = (payload) => ({
  payload,
  type: CHANGE_ALL_NOTIFICATION_SETTINGS,
});

export const changeNotificationSettings = (payload) => {
  switch (payload.type) {
    case 'notification.follow':
      return {
        payload: payload.action,
        type: CHANGE_FOLLOW_NOTIFICATION,
      };

    case 'notification.vote':
      return {
        payload: payload.action,
        type: CHANGE_VOTE_NOTIFICATION,
      };

    case 'notification.comment':
      return {
        payload: payload.action,
        type: CHANGE_COMMENT_NOTIFICATION,
      };

    case 'notification.mention':
      return {
        payload: payload.action,
        type: CHANGE_MENTION_NOTIFICATION,
      };

    case 'notification.reblog':
      return {
        payload: payload.action,
        type: CHANGE_REBLOG_NOTIFICATION,
      };

    case 'notification.transfers':
      return {
        payload: payload.action,
        type: CHANGE_TRANSFERS_NOTIFICATION,
      };

    case 'notification':
      return {
        payload: payload.action,
        type: IS_NOTIFICATION_OPEN,
      };

    default:
      return null;
  }
};

export const isDarkTheme = (payload) => ({
  payload,
  type: IS_DARK_THEME,
});

export const setColorTheme = (payload:number) => ({
  payload,
  type: SET_COLOR_THEME
})

export const isPinCodeOpen = (payload) => ({
  payload,
  type: IS_PIN_CODE_OPEN,
});

export const setConnectivityStatus = (payload) => ({
  payload,
  type: IS_CONNECTED,
});

export const setAnalyticsStatus = (payload) => ({
  payload,
  type: IS_ANALYTICS,
});

export const setNsfw = (payload) => ({
  payload,
  type: SET_NSFW,
});

export const isDefaultFooter = (payload) => ({
  payload,
  type: IS_DEFAULT_FOOTER,
});

/**
 * MW
 */
export const setCurrency = (currency) => async (dispatch) => {
  const currencySymbol = getSymbolFromCurrency(currency);

  const currencyRate = await getCurrencyRate(currency)
  dispatch({
    type: SET_CURRENCY,
    payload: { currency, currencyRate, currencySymbol },
  })
};

export const setPinCode = (data) => ({
  type: SET_PIN_CODE,
  payload: data,
});

export const isRenderRequired = (payload) => ({
  payload,
  type: IS_RENDER_REQUIRED,
});

export const setLastAppVersion = (versionNumber:string) => ({
  payload:versionNumber,
  type: SET_LAST_APP_VERSION
})

export const setSettingsMigrated = (isMigrated:boolean) => ({
  payload:isMigrated,
  type: SET_SETTINGS_MIGRATED
})

export const setHidePostsThumbnails = (shouldHide:boolean) => ({
  payload:shouldHide,
  type: HIDE_POSTS_THUMBNAILS,
});

export const setIsTermsAccepted = (isTermsAccepted:boolean) => ({
  payload:isTermsAccepted,
  type: SET_TERMS_ACCEPTED
})



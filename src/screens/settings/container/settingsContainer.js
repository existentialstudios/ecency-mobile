import React, { Component } from 'react';
import { Platform, Alert, Appearance } from 'react-native';
import { connect } from 'react-redux';
import { Client } from '@hiveio/dhive';
import VersionNumber from 'react-native-version-number';
import Config from 'react-native-config';
import { injectIntl } from 'react-intl';
import messaging from '@react-native-firebase/messaging';
import { languageRestart } from '../../../utils/I18nUtils';
import THEME_OPTIONS from '../../../constants/options/theme';

// Realm
import {
  getExistUser,
  setCurrency as setCurrency2DB,
  setServer,
  setNotificationSettings,
  setLanguage as setLanguage2DB,
  setNsfw as setNsfw2DB,
  setTheme,
  setPinCodeOpen,
  removeUserData,
  removePinCode,
  setAuthStatus,
  setExistUser,
  removeAllUserData,
  getTheme,
} from '../../../realm/realm';

// Services and Actions
import {
  setLanguage,
  changeNotificationSettings,
  setCurrency,
  setApi,
  isDarkTheme,
  isDefaultFooter,
  openPinCodeModal,
  setNsfw,
  isPinCodeOpen,
  setPinCode as savePinCode,
  login,
  logoutDone,
  closePinCodeModal,
  setColorTheme,
} from '../../../redux/actions/applicationActions';
import { toastNotification } from '../../../redux/actions/uiAction';
import { setPushToken, getNodes } from '../../../providers/ecency/ecency';
import { checkClient } from '../../../providers/hive/dhive';
import { updatePinCode } from '../../../providers/hive/auth';
import { removeOtherAccount, updateCurrentAccount } from '../../../redux/actions/accountAction';
// Middleware

// Constants
import { VALUE as CURRENCY_VALUE } from '../../../constants/options/currency';
import { VALUE as LANGUAGE_VALUE } from '../../../constants/options/language';

// Utilities
import { sendEmail } from '../../../utils/sendEmail';
import { encryptKey, decryptKey } from '../../../utils/crypto';

// Component
import SettingsScreen from '../screen/settingsScreen';
import { SERVER_LIST } from '../../../constants/options/api';

/*
 *            Props Name        Description                                     Value
 *@props -->  props name here   description here                                Value Type Here
 *
 */

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverList: [],
      isNotificationMenuOpen: props.isNotificationSettingsOpen,
      isLoading: false,
    };
  }

  // Component Life Cycle Functions
  componentDidMount() {
    getNodes()
      .then((resp) => {
        this.setState({
          serverList: resp,
        });
      })
      .catch(() =>
        this.setState({
          serverList: SERVER_LIST,
        }),
      );
  }

  // Component Functions
  _handleDropdownSelected = async (action, actionType) => {
    const { dispatch, selectedLanguage, intl } = this.props;
    switch (actionType) {
      case 'currency':
        this._currencyChange(action);
        break;

      case 'language':
        await dispatch(setLanguage(LANGUAGE_VALUE[action]));
        await setLanguage2DB(LANGUAGE_VALUE[action]);
        await languageRestart(selectedLanguage, LANGUAGE_VALUE[action], intl); //restart the app and flip change layout according to lang direction
        break;

      case 'api':
        this._changeApi(action);
        break;

      case 'nsfw':
        dispatch(setNsfw(action));
        setNsfw2DB(action);
        break;

      case 'theme':
        let setting = THEME_OPTIONS[action].value;
        const systemTheme = Appearance.getColorScheme();

        dispatch(isDarkTheme(setting === null ? systemTheme === 'dark' : setting));
        dispatch(setColorTheme(action));
        setTheme(setting); //TODO: remove before merging

        break;

      default:
        break;
    }
  };

  _changeApi = async (action) => {
    const { dispatch, selectedApi, intl } = this.props;
    const { serverList } = this.state;
    const server = serverList[action];
    let serverResp;
    let isError = false;
    let alertMessage;
    const client = new Client([server, 'https://rpc.ecency.com'], {
      timeout: 4000,
      failoverThreshold: 10,
      consoleOnFailover: true,
    });
    dispatch(setApi(''));

    this.setState({
      isLoading: true,
    });

    try {
      serverResp = await client.database.getDynamicGlobalProperties();
    } catch (e) {
      isError = true;
      alertMessage = 'alert.connection_fail';
    } finally {
      if (!isError) {
        alertMessage = 'alert.connection_success';
      }
    }

    if (!isError) {
      const localTime = new Date(new Date().toISOString().split('.')[0]);
      const serverTime = new Date(serverResp.time);
      const isAlive = localTime - serverTime < 15000;

      if (!isAlive) {
        alertMessage = 'settings.server_fail';

        isError = true;

        return;
      }
    }

    if (isError) {
      dispatch(setApi(selectedApi));
    } else {
      await setServer(server);
      dispatch(setApi(server));
      checkClient();
    }

    this.setState({
      isLoading: false,
    });
    dispatch(
      toastNotification(
        intl.formatMessage({
          id: alertMessage,
        }),
      ),
    );
  };

  _currencyChange = (action) => {
    const { dispatch } = this.props;

    dispatch(setCurrency(CURRENCY_VALUE[action]));
    setCurrency2DB(CURRENCY_VALUE[action]);
  };

  _handleToggleChanged = (action, actionType) => {
    const { dispatch } = this.props;

    switch (actionType) {
      case 'notification':
      case 'notification.follow':
      case 'notification.vote':
      case 'notification.comment':
      case 'notification.mention':
      case 'notification.reblog':
      case 'notification.transfers':
        this._handleNotification(action, actionType);
        break;

      case 'default_footer':
        dispatch(isDefaultFooter(action));
        // setDefaultFooter(action);
        break;

      case 'pincode':
        if (action) {
          dispatch(
            openPinCodeModal({
              callback: () => this._setDefaultPinCode(action),
              isReset: true,
              isOldPinVerified: true,
              oldPinCode: Config.DEFAULT_PIN,
            }),
          );
        } else {
          dispatch(
            openPinCodeModal({
              callback: () => this._setDefaultPinCode(action),
            }),
          );
        }
        break;
      default:
        break;
    }
  };

  _handleNotification = async (action, actionType) => {
    const { dispatch, notificationDetails } = this.props;
    const notifyTypesConst = {
      vote: 1,
      mention: 2,
      follow: 3,
      comment: 4,
      reblog: 5,
      transfers: 6,
    };
    const notifyTypes = [];

    dispatch(
      changeNotificationSettings({
        action,
        type: actionType,
      }),
    );
    //TODO: remove setting notification settings
    setNotificationSettings({
      action,
      type: actionType,
    });

    Object.keys(notificationDetails).map((item) => {
      const notificationType = item.replace('Notification', '');

      if (notificationType === actionType.replace('notification.', '')) {
        if (action) {
          notifyTypes.push(notifyTypesConst[notificationType]);
        }
      } else if (notificationDetails[item]) {
        notifyTypes.push(notifyTypesConst[notificationType]);
      }
    });
    notifyTypes.sort();

    if (actionType === 'notification') {
      this._setPushToken(action ? notifyTypes : []);
    } else {
      this._setPushToken(notifyTypes);
    }
  };

  _handleButtonPress = (actionType) => {
    const { dispatch } = this.props;
    switch (actionType) {
      case 'reset_pin':
        dispatch(
          openPinCodeModal({
            isReset: true,
          }),
        );
        break;

      case 'feedback':
        this._handleSendFeedback();
        break;
      default:
        break;
    }
  };

  _handleOnChange = (action, type, actionType = null) => {
    switch (type) {
      case 'dropdown':
        this._handleDropdownSelected(action, actionType);
        break;

      case 'toggle':
        this._handleToggleChanged(action, actionType);
        break;

      default:
        break;
    }
  };

  _setPushToken = async (notifyTypes) => {
    const { isLoggedIn, otherAccounts = [] } = this.props;

    if (isLoggedIn) {
      getExistUser().then((isExistUser) => {
        if (isExistUser) {
          otherAccounts.forEach((item) => {
            const { isNotificationSettingsOpen } = this.props;

            messaging()
              .getToken()
              .then((token) => {
                const data = {
                  username: item.username,
                  token,
                  system: `fcm-${Platform.OS}`,
                  allows_notify: Number(isNotificationSettingsOpen),
                  notify_types: notifyTypes,
                };
                setPushToken(data);
              });
          });
        }
      });
    }
  };

  _handleSendFeedback = async () => {
    const { dispatch, intl } = this.props;
    let message;

    await sendEmail(
      'bug@ecency.com',
      'Feedback/Bug report',
      `Write your message here!

      App version: ${VersionNumber.buildVersion}
      Platform: ${Platform.OS === 'ios' ? 'IOS' : 'Android'}`,
    )
      .then(() => {
        message = 'settings.feedback_success';
      })
      .catch(() => {
        message = 'settings.feedback_fail';
      });

    if (message) {
      dispatch(
        toastNotification(
          intl.formatMessage({
            id: message,
          }),
        ),
      );
    }
  };

  _clearUserData = async () => {
    const { otherAccounts, dispatch } = this.props;

    await removeAllUserData()
      .then(async () => {
        dispatch(updateCurrentAccount({}));
        dispatch(login(false));
        removePinCode();
        setAuthStatus({ isLoggedIn: false });
        setExistUser(false);
        if (otherAccounts.length > 0) {
          otherAccounts.map((item) => dispatch(removeOtherAccount(item.username)));
        }
        dispatch(logoutDone());
        dispatch(isPinCodeOpen(false));
        setPinCodeOpen(false);
      })
      .catch((err) => {
        console.warn('Failed to remove user data', err);
      });
  };

  _onDecryptFail = () => {
    const { intl } = this.props;
    setTimeout(() => {
      Alert.alert(
        intl.formatMessage({
          id: 'alert.warning',
        }),
        intl.formatMessage({
          id: 'alert.decrypt_fail_alert',
        }),
        [
          { text: intl.formatMessage({ id: 'alert.clear' }), onPress: () => this._clearUserData() },
          { text: intl.formatMessage({ id: 'alert.cancel' }), style: 'destructive' },
        ],
      );
    }, 500);
  };

  _setDefaultPinCode = (action) => {
    const { dispatch, username, currentAccount, pinCode } = this.props;

    if (!action) {
      const oldPinCode = decryptKey(pinCode, Config.PIN_KEY, this._onDecryptFail);

      if (oldPinCode === undefined) {
        return;
      }

      const pinData = {
        pinCode: Config.DEFAULT_PIN,
        username,
        oldPinCode,
      };
      updatePinCode(pinData)
        .then((response) => {
          const _currentAccount = currentAccount;
          _currentAccount.local = response;

          dispatch(
            updateCurrentAccount({
              ..._currentAccount,
            }),
          );

          const encryptedPin = encryptKey(Config.DEFAULT_PIN, Config.PIN_KEY);
          dispatch(savePinCode(encryptedPin));

          setPinCodeOpen(action);
          dispatch(isPinCodeOpen(action));
        })
        .catch((err) => {
          console.warn('pin update failure: ', err);
          this._onDecryptFail();
        });
    } else {
      setPinCodeOpen(action);
      dispatch(isPinCodeOpen(action));
    }
  };

  render() {
    const { serverList, isNotificationMenuOpen, isLoading } = this.state;
    const { colorTheme } = this.props;

    return (
      <SettingsScreen
        serverList={serverList}
        handleOnChange={this._handleOnChange}
        isNotificationMenuOpen={isNotificationMenuOpen}
        handleOnButtonPress={this._handleButtonPress}
        isLoading={isLoading}
        colorThemeIndex={colorTheme}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isDarkTheme: state.application.isDarkTheme,
  colorTheme: state.application.colorTheme,
  isPinCodeOpen: state.application.isPinCodeOpen,
  pinCode: state.application.pin,
  isDefaultFooter: state.application.isDefaultFooter,
  isLoggedIn: state.application.isLoggedIn,
  isNotificationSettingsOpen: state.application.isNotificationOpen,
  nsfw: state.application.nsfw,
  notificationDetails: state.application.notificationDetails,
  commentNotification: state.application.notificationDetails.commentNotification,
  followNotification: state.application.notificationDetails.followNotification,
  mentionNotification: state.application.notificationDetails.mentionNotification,
  reblogNotification: state.application.notificationDetails.reblogNotification,
  transfersNotification: state.application.notificationDetails.transfersNotification,
  voteNotification: state.application.notificationDetails.voteNotification,
  selectedApi: state.application.api,
  selectedCurrency: state.application.currency,
  selectedLanguage: state.application.language,
  username: state.account.currentAccount && state.account.currentAccount.name,
  currentAccount: state.account.currentAccount,
  otherAccounts: state.account.otherAccounts,
});

export default injectIntl(connect(mapStateToProps)(SettingsContainer));

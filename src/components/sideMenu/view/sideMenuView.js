import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { injectIntl, useIntl } from 'react-intl';
import LinearGradient from 'react-native-linear-gradient';
import VersionNumber from 'react-native-version-number';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { getStorageType } from '../../../realm/realm';

// Components
import { Icon } from '../../icon';
import { UserAvatar } from '../../userAvatar';
import { TextWithIcon } from '../../basicUIElements';

// Constants
import MENU from '../../../constants/sideMenuItems';
import ROUTES from '../../../constants/routeNames';

//Utils
import { getVotingPower } from '../../../utils/manaBar';

// Styles
import styles from './sideMenuStyles';
import { OptionsModal } from '../../atoms';
import { toggleQRModal } from '../../../redux/actions/uiAction';

// Images
const SIDE_MENU_BACKGROUND = require('../../../assets/side_menu_background.png');

const SideMenuView = ({
  currentAccount,
  isLoggedIn,
  handleLogout,
  navigateToRoute,
  handlePressOptions,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const ActionSheetRef = useRef(null);

  const [menuItems, setMenuItems] = useState(
    isLoggedIn ? MENU.AUTH_MENU_ITEMS : MENU.NO_AUTH_MENU_ITEMS,
  );
  const [storageT, setStorageT] = useState('R');
  const [upower, setUpower] = useState(0);

  // Component Life Cycles
  useEffect(() => {
    let _isMounted = false;
    getStorageType().then((item) => {
      if (!_isMounted) {
        setStorageT(item);
      }
    });
    return () => {
      _isMounted = true;
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && !isEmpty(currentAccount)) {
      setUpower(getVotingPower(currentAccount).toFixed(1));
    }
  });

  // Component Functions
  const _handleOnMenuItemPress = (item) => {
    if (item.id === 'logout') {
      ActionSheetRef.current.show();
      return;
    }

    /* if (item.id === 'refer') {
      const shareUrl = `https://ecency.com/signup?referral=${currentAccount.username}`;
      Share.share({
        message: shareUrl,
      });
      return;
    } */
    if (item.id === 'qr') {
      dispatch(toggleQRModal(true));
      return;
    }

    if (item.id === 'schedules') {
      navigateToRoute({
        routeName: ROUTES.SCREENS.DRAFTS,
        params: {
          showSchedules: true,
        },
      });
      return;
    }

    navigateToRoute(item.route);
  };

  useEffect(() => {
    setMenuItems(isLoggedIn ? MENU.AUTH_MENU_ITEMS : MENU.NO_AUTH_MENU_ITEMS);
  }, [isLoggedIn]);

  const { buildVersion, appVersion } = VersionNumber;

  let _username = currentAccount.name;

  const _renderItem = (item) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        _handleOnMenuItemPress(item.item);
      }}
    >
      <View style={styles.itemWrapper}>
        {item.item.icon && (
          <Icon
            iconType={item.item.iconType ? item.item.iconType : 'SimpleLineIcons'}
            style={styles.listItemIcon}
            name={item.item.icon}
          />
        )}
        {item.item.username && (
          <UserAvatar noAction username={item.item.username} style={styles.otherUserAvatar} />
        )}
        <Text style={styles.listItemText}>
          {intl.formatMessage({ id: `side_menu.${item.item.id}` })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#357ce6', '#2d5aa0']}
        style={styles.headerView}
      >
        <ImageBackground source={SIDE_MENU_BACKGROUND} style={styles.imageBackground}>
          {isLoggedIn && (
            <View style={styles.headerContentWrapper}>
              <UserAvatar username={currentAccount.name} size="xl" style={styles.userAvatar} />
              <View
                style={[
                  styles.userInfoWrapper,
                  currentAccount.display_name && { alignSelf: 'flex-start' },
                ]}
              >
                {currentAccount.display_name && (
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>
                    {currentAccount.display_name}
                  </Text>
                )}
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.usernick}>
                  {`@${_username}`}
                </Text>
                <TextWithIcon
                  iconName="expand-less"
                  iconSize={30}
                  iconType="MaterialIcons"
                  text={`${upower}%`}
                  textStyle={styles.vpText}
                />
              </View>

              <TouchableOpacity style={styles.iconWrapper} onPress={handlePressOptions}>
                <Icon
                  iconType="SimpleLineIcons"
                  style={styles.optionIcon}
                  name="options"
                  color="white"
                  size={16}
                />
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      </LinearGradient>
      <View style={styles.contentView}>
        <FlatList data={menuItems} keyExtractor={(item) => item.id} renderItem={_renderItem} />
      </View>
      <Text style={styles.versionText}>{`v${appVersion}, ${buildVersion}${storageT}`}</Text>
      <OptionsModal
        ref={ActionSheetRef}
        options={[
          intl.formatMessage({ id: 'side_menu.logout' }),
          intl.formatMessage({ id: 'side_menu.cancel' }),
        ]}
        title={intl.formatMessage({ id: 'side_menu.logout_text' })}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={(index) => {
          index === 0 ? handleLogout() : null;
        }}
      />
    </View>
  );
};

export default injectIntl(SideMenuView);

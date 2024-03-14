import axios from 'axios';
import React, {useEffect} from 'react';
import FlashMessage from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {userLogout} from '../actions';
import LoadingDialog from '../components/Modals/LoadingDialog';
import {navigate} from '../navigation/RootNavigation';

import {Platform} from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

export default function SettingsProvider({children}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        if (response.status === 401 || response.status === 403) {
          navigate('auth');
          dispatch(userLogout());
          console.log(
            'TOKEN EXPIRED, REDIRECTING TO LOGIN SCREEN...',
            response.status,
          );
        }
        return response;
      },
      (error) => {
        if (error.response.status === 401 || response.status === 403) {
          navigate('auth');
          dispatch(userLogout());
          console.log('TOKEN EXPIRED, REDIRECTING TO LOGIN SCREEN...');
        }
        return Promise.reject(error);
      },
    );
  }, [currentUser]);

  useEffect(() => {
    checkAppUpdate();
  }, []);

  const checkAppUpdate = async () => {
    const inAppUpdates = new SpInAppUpdates(__DEV__ ? true : false);
    inAppUpdates
      .checkNeedsUpdate(Platform.select({ios: {country: 'IN'}, android: {}}))
      .then((result) => {
        if (result.shouldUpdate) {
          const updateOptions: StartUpdateOptions = Platform.select({
            ios: {
              title: 'Update available',
              message:
                'There is a new version of the app available on the App Store, do you want to update it?',
              buttonUpgradeText: 'Update',
              buttonCancelText: 'Cancel',
              country: 'IN',
            },
            android: {
              updateType: IAUUpdateKind.IMMEDIATE,
            },
          });
          inAppUpdates.startUpdate(updateOptions);
        }
      });
  };

  return (
    <>
      {children}
      <FlashMessage position="top" />
      <LoadingDialog />
    </>
  );
}

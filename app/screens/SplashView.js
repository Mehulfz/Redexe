import AsyncStorage from '@react-native-community/async-storage';
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import {setLoginUser} from '../actions';
import {navigationReset} from '../navigation/RootNavigation';

function SplashView() {
  const dispatch = useDispatch();
  useEffect(() => {
    _checkAuth();
  }, []);

  const _checkAuth = async () => {
    try {
      const value = await AsyncStorage.getItem('@auth');
      if (value !== null) {
        dispatch(setLoginUser(JSON.parse(value)));
        // return _navigation('dashboard'); // navigate to dashboard
      }
    } catch (e) {}
    return _navigation('dashboard'); // navigate to authentication
  };

  const _navigation = (router, params) => {
    SplashScreen.hide();
    navigationReset(router, params);
  };

  return null;
}

export default SplashView;

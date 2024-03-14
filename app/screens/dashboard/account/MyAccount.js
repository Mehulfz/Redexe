/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, ms, scale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import app from '../../../../app.json';
import {getProfile, userLogout} from '../../../actions';
import assets from '../../../assets';
import Avatar from '../../../components/Avatar';
import EmptyList from '../../../components/EmptyList';
import Header from '../../../components/Header';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import {navigate, navigationReset} from '../../../navigation/RootNavigation';

export default function MyAccount({navigation}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);
  const IsFocused = useIsFocused();

  useEffect(() => {
    if (IsFocused && currentUser) {
      dispatch(getProfile());
    }
  }, [IsFocused]);

  const logout = () => {
    Alert.alert(
      'Sign out?',
      'You can always access your content by signing back in',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            dispatch(userLogout());
            navigationReset('dashboard');
          },
        },
      ],
      {cancelable: false},
    );
  };

  if (!currentUser) {
    return (
      <EmptyList
        containStyle={{backgroundColor: colors.white}}
        message={'Login to access your account.'}
        bottom={
          <Text onPress={() => navigate('auth')} style={styles.hyperLink}>
            Login to your account
          </Text>
        }
      />
    );
  }

  return (
    <View style={styles.root}>
      <Header
        title="My Account"
        rightActions={
          <TouchableOpacity
            style={{padding: 10, marginRight: ms(5)}}
            onPress={() =>
              navigation.navigate(currentUser ? 'profile' : 'auth')
            }>
            <Image source={assets.account_ic} style={styles.actionIcon} />
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userContainer}>
          <Avatar
            size={scale(100)}
            source={{uri: currentUser?.profile_image}}
          />
          <View style={[styles.row, {marginTop: 15, marginBottom: 5}]}>
            <Text style={styles.username}>
              {currentUser?.first_name} {currentUser?.last_name}
            </Text>
            <TouchableOpacity
              style={{padding: 5}}
              onPress={() => navigation.navigate('editProfile')}>
              <Image source={assets.edit_ic} style={styles.edit_ic} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
        </View>

        <View style={{padding: 15}}>
          <TouchableOpacity
            style={styles.box}
            onPress={() =>
              navigation.navigate(currentUser ? 'profile' : 'auth')
            }>
            <Image source={assets.account_ic} style={styles.boxIcon} />
            <Text style={styles.boxText}>My Profile</Text>
            <Image source={assets.arrow_right_ic} style={styles.arrowIc} />
          </TouchableOpacity>
          <View style={{height: 15}} />
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate('manageAddress')}>
            <Image source={assets.loation_icon} style={styles.boxIcon} />
            <Text style={styles.boxText}>Manage Address</Text>
            <Image source={assets.arrow_right_ic} style={styles.arrowIc} />
          </TouchableOpacity>
          <View style={{height: 15}} />
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigation.navigate('myOrders')}
              style={styles.box}>
              <Image source={assets.order_icon} style={styles.boxIcon} />
              <Text style={styles.boxText}>My orders</Text>
            </TouchableOpacity>
            <View style={{width: 15}} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('myOrders', {
                  status: 1,
                  title: 'Processing',
                })
              }
              style={styles.box}>
              <Image source={assets.process_icon} style={styles.boxIcon} />
              <Text style={styles.boxText}>Processing</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('myOrders', {status: 2, title: 'Shipped'})
              }
              style={styles.box}>
              <Image source={assets.package_icon} style={styles.boxIcon} />
              <Text style={styles.boxText}>Shipped</Text>
            </TouchableOpacity>
            <View style={{width: 15}} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('myOrders', {
                  status: 4,
                  title: 'Dispute Orders',
                })
              }
              style={styles.box}>
              <Image source={assets.rating} style={styles.boxIcon} />
              <Text style={styles.boxText}>Dispute Orders</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.box}
              onPress={() =>
                navigation.navigate('myOrders', {status: 5, title: 'Cancelled'})
              }>
              <Image source={assets.order_icon} style={styles.boxIcon} />
              <Text style={styles.boxText}>Cancelled</Text>
            </TouchableOpacity>
            <View style={{width: 15}} />
            <TouchableOpacity
              onPress={() => navigation.navigate('sellerFeedback')}
              style={styles.box}>
              <Image source={assets.feedback} style={styles.boxIcon} />
              <Text style={styles.boxText}>Feedback</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />
          <TouchableOpacity
            onPress={() => navigation.navigate('promotionalCoupons')}
            style={styles.box}>
            <Image source={assets.offers_ic} style={styles.boxIcon} />
            <Text style={styles.boxText}>Coupon Code</Text>
            <Image source={assets.arrow_right_ic} style={styles.arrowIc} />
          </TouchableOpacity>
          <View style={{height: 15}} />
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => Linking.openURL(app.helpLink)}
              style={styles.box}>
              <Image source={assets.help_ic} style={styles.boxIcon} />
              <Text style={styles.boxText}>Help</Text>
            </TouchableOpacity>
            <View style={{width: 15}} />
            <TouchableOpacity
              onPress={() => Linking.openURL(app.privacyLink)}
              style={styles.box}>
              <Image source={assets.doc} style={styles.boxIcon} />
              <Text style={styles.boxText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />

          <View style={styles.row}>
            <TouchableOpacity style={styles.box} onPress={logout}>
              <Image source={assets.logout} style={styles.boxIcon} />
              <Text style={[styles.boxText, {color: colors.red}]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  userContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  username: {
    fontFamily: env.fontBold,
    fontSize: moderateScale(16),
    color: colors.primary,
  },
  userEmail: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.darkGray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  edit_ic: {
    resizeMode: 'contain',
    height: 14,
    width: 14,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(197, 206, 224, 0.12)',
    flex: 1,
    padding: 20,
    height: '100%',
  },
  boxIcon: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
  },
  boxText: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.black,
    marginLeft: 10,
    flex: 1,
  },
  hyperLink: {
    textDecorationLine: 'underline',
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
  },
  arrowIc: {
    resizeMode: 'contain',
    height: 13,
    width: 13,
    tintColor: colors.black,
  },
  actionIcon: {
    tintColor: colors.white,
    resizeMode: 'contain',
    height: ms(24),
    width: ms(24),
  },
});

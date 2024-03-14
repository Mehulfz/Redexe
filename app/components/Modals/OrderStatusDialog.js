/* eslint-disable react-native/no-inline-styles */
import { StackActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View, Platform, ToastAndroid } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, ms } from 'react-native-size-matters';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import { Button } from '../Buttons';
import Clipboard from '@react-native-clipboard/clipboard';

export function OrderStatusDialog({ isVisible, onClose, data }) {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const IsFail = !data?.status;

  const _navigate = (route) => {
    navigation.dispatch(StackActions.replace(route));
  };

  const _close = () => {
    onClose();
    if (!IsFail) {
      navigation.dispatch(StackActions.replace('dashboard'));
    }
  };

  const _copyString = (text) => {
    Clipboard.setString(text);
    if (Platform.OS === "android") {
      ToastAndroid.show(text + " copy to clipboard", ToastAndroid.SHORT)
    }
  }

  const renderFooter = () => {
    if (IsFail) {
      return (
        <View style={styles.footer}>
          <Button
            title={'Close'}
            containerStyle={{ ...styles.btn, flex: 1 }}
            titleStyle={styles.btnText}
            onPress={_close}
          />
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        <Button
          title={'Close'}
          containerStyle={styles.btn}
          titleStyle={styles.btnText}
          onPress={_close}
        />
        <View style={{ width: ms(10) }} />
        <Button
          title={'My Orders'}
          containerStyle={styles.btnOutline}
          titleStyle={{ ...styles.btnText, color: colors.black }}
          onPress={() => _navigate('myOrders')}
        />
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      backdropOpacity={0.8}
      swipeDirection="down"
      onSwipeComplete={_close}
      avoidKeyboard>
      <View style={styles.root}>
        <View style={styles.swipeIndicator} />
        <Text style={styles.title}>
          {IsFail ? 'Payment Failed' : 'Payment Successful'}
        </Text>
        {IsFail ? (
          <>
            {
              data?.payment_id ? <Text style={[styles.detailsText, { marginBottom: 5 }]}>
                Transaction ID : <Text onPress={() => _copyString(data?.payment_id)}>{data?.payment_id}</Text>
              </Text> : null
            }
            <Text style={styles.failReason} numberOfLines={4}>
              {data?.reason}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.detailsText}>
              Transaction ID : <Text onPress={() => _copyString(data?.payment_id)}>{data?.payment_id}</Text>
            </Text>
            {/* <Text style={styles.detailsText}>Order ID : AFG12345</Text> */}
          </>
        )}
        <Image
          source={IsFail ? assets.failStatus : assets.successStatus}
          style={styles.statusImg}
        />

        {renderFooter()}

        <View style={{ height: bottom }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
  },
  swipeIndicator: {
    height: ms(4),
    width: ms(100),
    backgroundColor: colors.Gray,
    alignSelf: 'center',
    marginBottom: ms(20),
  },
  title: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(18),
    color: colors.black,
    textAlign: 'center',
    marginBottom: ms(10),
  },
  detailsText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.primary,
    textAlign: 'center',
    lineHeight: ms(22),
  },
  failReason: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: '#747B81',
    textAlign: 'center',
    lineHeight: ms(18),
    marginBottom: ms(10),
  },
  statusImg: {
    resizeMode: 'contain',
    height: Dimensions.get('screen').height * 0.4,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),
  },
  btn: {
    flex: 1 / 2,
    borderRadius: moderateScale(5),
    height: moderateScale(45),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  btnOutline: {
    flex: 1 / 2,
    borderRadius: moderateScale(5),
    height: moderateScale(45),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  btnText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
  },
});

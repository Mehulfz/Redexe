import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {
  flashMessage,
  otpVerify,
  rootLoader,
  sendOTPForAccount,
} from '../../actions';
import assets from '../../assets';
import {Button} from '../../components/Buttons';
import {Input} from '../../components/Inputs';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {convertToTimer, emailValidate} from '../../utils/arrayOperations';

const TIMER_COUNT = 60;

function AccountVerification({navigation, route}) {
  const paramData = route.params?.data;
  const dispatch = useDispatch();

  const [otp, setOTP] = useState('');
  const [IsTimer, setIsTimer] = useState(false);
  const [timer, setTimer] = useState(TIMER_COUNT);
  const _timerCount = useRef(1);
  const _timerRef = useRef();
  const IsPhone = !emailValidate(paramData?.email_or_phone);

  useEffect(() => {
    _statTimer();
  }, []);

  useEffect(() => {
    _timerRef.current = setTimeout(() => {
      if (!timer) {
        _timerCount.current += 1;
        setIsTimer(false);
        clearTimeout(_timerRef.current);
      } else {
        if (IsTimer) {
          setTimer(timer - 1);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(_timerRef.current);
    };
  }, [timer, IsTimer]);

  const _statTimer = () => {
    setTimer(TIMER_COUNT);
    setIsTimer(true);
  };

  const _sendOTP = async () => {
    dispatch(rootLoader(true));
    await dispatch(sendOTPForAccount({...paramData, via: 'sms'}));
    dispatch(rootLoader(false));
    flashMessage('Success!', 'OTP resend successfully.', 'success');
    _statTimer();
  };

  const _sendOTPonCall = async () => {
    dispatch(rootLoader(true));
    await dispatch(sendOTPForAccount({...paramData, via: 'voice'}));
    dispatch(rootLoader(false));
    _statTimer();
    _timerCount.current = 0;
  };

  const _submit = async () => {
    try {
      if (!otp?.trim()) {
        return flashMessage('Required!', 'Please enter OTP number.', 'warning');
      }
      await dispatch(otpVerify({...paramData, otp}));
    } catch (error) {
      console.log('Forgot error: ', error);
      flashMessage('Error!', 'Opps! Something is wrong.', 'warning');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <SafeAreaView />
      <TouchableOpacity onPress={navigation.goBack}>
        <Image source={assets.backArrow} style={styles.backArrow} />
      </TouchableOpacity>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, padding: ms(20)}}>
        <Text style={styles.title}>
          Enter OTP send to {paramData?.email_or_phone}
        </Text>
        <View style={{height: 60}} />

        <Input
          title="One Time Password (OTP)"
          placeholder="type here"
          returnKeyType="done"
          value={otp}
          onChangeText={setOTP}
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
        />
        <Button
          title={'Submit'}
          onPress={_submit}
          containerStyle={{marginVertical: ms(40), height: ms(45)}}
        />
        {_timerCount.current <= 2 || IsTimer ? (
          <Text style={styles.resentOTP}>
            <Text style={{color: colors.black}}>Not received yet?</Text>{' '}
            {IsTimer ? (
              convertToTimer(timer)
            ) : (
              <Text onPress={_sendOTP}>Resend OTP</Text>
            )}
          </Text>
        ) : null}

        {!IsTimer && _timerCount.current > 2 && IsPhone ? (
          <Button
            title={'Get OTP on call'}
            onPress={_sendOTPonCall}
            containerStyle={{
              marginVertical: ms(40),
              height: ms(45),
              backgroundColor: colors.lightGray,
            }}
            titleStyle={{color: colors.black, fontFamily: env.fontRegular}}
          />
        ) : null}
      </KeyboardAwareScrollView>
      <SafeAreaView />
    </View>
  );
}

export default AccountVerification;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(18),
    color: colors.black,
    textAlign: 'center',
  },
  backArrow: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
    tintColor: colors.primary,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  resentOTP: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    color: colors.primary,
    textAlign: 'center',
  },
});

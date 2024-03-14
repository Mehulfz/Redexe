import React, {useState, useEffect} from 'react';
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
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {
  flashMessage,
  rootLoader,
  sendEmailVerification,
  sendOTPForAccount,
  userLogin,
} from '../../actions';
import assets, {FacebookIc, GoogleIc, AppleIc} from '../../assets';
import {Button} from '../../components/Buttons';
import {Input} from '../../components/Inputs';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate, navigationReset} from '../../navigation/RootNavigation';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import {appleAuth} from '@invertase/react-native-apple-authentication';
import Header from '../../components/Header';
import {LOGIN_OTP_TYPE} from '../../constants';

function Login({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(__DEV__ ? '8238523599' : '');
  const [password, setPassword] = useState();
  const [unverifiedEmail, setunverifiedEmail] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // useEffect(() => {
  //   GoogleSignin.configure();
  // }, []);

  const _submit = async () => {
    try {
      if (!email?.trim())
        return flashMessage(
          'Required!',
          'Please enter email address or phone number.',
          'warning',
        );
      else if (!password?.trim())
        return flashMessage('Required!', 'Please enter password.', 'warning');

      const request = {
        email_or_phone: email,
        password,
        type: 0,
      };
      dispatch(rootLoader(true));
      const {status, unverifiedEmail} = await dispatch(userLogin(request));
      dispatch(rootLoader(false));
      if (status) {
        return _handleLoginSuccess();
      } else {
        setunverifiedEmail(unverifiedEmail);
        // if (unverifiedEmail) _sendEmail();
      }
    } catch (error) {
      console.log('Login error: ', error);
      flashMessage('Warning!', 'Opps! Something is wrong.', 'warning');
    }
  };

  const _sendOTP = async () => {
    if (!email?.trim())
      return flashMessage(
        'Required!',
        'Please enter email address or phone number.',
        'warning',
      );
    dispatch(rootLoader(true));
    const res = await dispatch(
      sendOTPForAccount({email_or_phone: email, type: LOGIN_OTP_TYPE}),
    );
    dispatch(rootLoader(false));
    if (res?.status) {
      navigate('accountVerification', {
        data: {
          email_or_phone: email,
          type: LOGIN_OTP_TYPE,
        },
      });
    } else {
      flashMessage('Warning!', res?.message || 'Opps! Something is wrong.', 'warning');
    }
  };

  const _sendEmail = async () => {
    if (!email?.trim())
      return flashMessage(
        'Required!',
        'Please enter email address.',
        'warning',
      );
    dispatch(rootLoader(true));
    const res = await sendEmailVerification({email});
    dispatch(rootLoader(false));
    setunverifiedEmail(res);
  };

  const _handleLoginSuccess = () => {
    return navigationReset('dashboard');
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     if (socialLoading) return;
  //     setSocialLoading(true);
  //     await GoogleSignin.hasPlayServices();
  //     const {idToken} = await GoogleSignin.signIn();
  //     console.log('GoogleSignin Success: ', idToken);
  //     const {status} = await dispatch(
  //       userLogin({type: 1, google_token: idToken}),
  //     );
  //     setSocialLoading(false);
  //     if (status) return _handleLoginSuccess();
  //   } catch (error) {
  //     setSocialLoading(false);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       return;
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       flashMessage('Error!', 'Operation is in progress already.', 'danger');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       flashMessage(
  //         'Error!',
  //         'Play services not available or outdated.',
  //         'danger',
  //       );
  //     } else {
  //       flashMessage('Error!', 'Oops!  Something is wrong', 'danger');
  //     }
  //     console.log('GoogleSignin Error: ', JSON.stringify(error));
  //   }
  // };

  // const _appleLogin = async () => {
  //   try {
  //     if (socialLoading) return;
  //     setSocialLoading(true);
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.IMPLICIT,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });
  //     if (!appleAuthRequestResponse.identityToken) {
  //       Alert.alert('', 'Apple Sign-In failed - no identify token returned');
  //       console.log('Apple Sign-In failed - no identify token returned');
  //       return false;
  //     }
  //     console.log('appleAuthRequestResponse', appleAuthRequestResponse);
  //   } catch (error) {
  //     setSocialLoading(false);
  //     console.log(error);
  //   }
  // };

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <TouchableOpacity onPress={() => navigation.navigate('home')}>
        <Image source={assets.backArrow} style={styles.backArrow} />
      </TouchableOpacity>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, padding: 20}}
        showsVerticalScrollIndicator={false}>
        {/* <TouchableOpacity onPress={navigation.goBack}>
          <Image source={assets.backArrow} style={styles.backIc} />
        </TouchableOpacity> */}
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image source={assets.logo} style={styles.logo} />

          {/* <Text style={styles.title}>Sign In</Text> */}
          <View style={{height: 40}} />
          <Input
            title="Email or phone number"
            placeholder="type here"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={{height: 15}} />

          <Input
            title="Password"
            placeholder="type here"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {unverifiedEmail && (
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={_sendEmail}>
              <Text style={styles.resentEmail}>Re-send verification email</Text>
            </TouchableOpacity>
          )}

          <View style={{height: moderateScale(30)}} />
          <Button title="Sign in" onPress={_submit} />
          <View style={{height: moderateScale(15)}} />
          <Button
            title="Sign in with OTP"
            onPress={_sendOTP}
            containerStyle={{backgroundColor: colors.Gray}}
            titleStyle={{color: colors.black}}
          />
          <View style={{height: moderateScale(20)}} />

          {/* <Text style={styles.orText}>OR</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={signInWithGoogle}>
              <GoogleIc width={moderateScale(50)} height={moderateScale(50)} />
            </TouchableOpacity>
            
              {appleAuth.isSignUpButtonSupported ? (
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={_appleLogin}>
                  <AppleIc
                    width={moderateScale(50)}
                    height={moderateScale(50)}
                  />
                </TouchableOpacity>
              ) : null}
          </View> */}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')}>
          <Text style={[styles.footerText, {marginVertical: 15}]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.rightMarg} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{'  '}
            <Text
              style={{color: colors.primary}}
              onPress={() => navigation.navigate('signUp')}>
              Sign Up
            </Text>
          </Text>
        </View>
        <View style={styles.leftMarg} />
      </View>
      <View style={styles.bottomMarg} />
      <SafeAreaView />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backIc: {
    resizeMode: 'contain',
    height: moderateScale(25),
    width: moderateScale(25),
    tintColor: colors.primary,
  },
  logo: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: moderateScale(130),
    width: moderateScale(130),
  },
  footer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderStyle: 'dashed',
    flex: 1,
  },
  footerText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.black,
    textAlign: 'center',
  },
  orText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(14),
    color: colors.black,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: moderateScale(15),
  },
  socialButton: {
    marginHorizontal: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resentEmail: {
    fontFamily: env.fontMedium,
    fontSize: 13,
    color: colors.primary,
    marginTop: 10,
  },
  rightMarg: {
    width: 1,
    backgroundColor: colors.white,
    marginRight: -1,
    height: '100%',
    zIndex: 1,
  },
  leftMarg: {
    width: 1,
    backgroundColor: colors.white,
    marginLeft: -1,
    height: '100%',
    zIndex: 1,
  },
  bottomMarg: {
    height: 1,
    backgroundColor: colors.white,
    marginTop: -1,
  },
  backArrow: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
    tintColor: colors.primary,
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

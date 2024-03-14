import React, {useState} from 'react';
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
import {flashMessage, forgotPasswordByEmail, rootLoader} from '../../actions';
import assets from '../../assets';
import {Button} from '../../components/Buttons';
import Header from '../../components/Header';
import {Input} from '../../components/Inputs';
import colors from '../../constants/colors';
import env from '../../constants/env';

function ForgotPassword({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const _submit = async () => {
    try {
      if (!email?.trim())
        return flashMessage(
          'Required!',
          'Please enter email address.',
          'warning',
        );
      dispatch(rootLoader(true));
      const {status} = await forgotPasswordByEmail({email});
      dispatch(rootLoader(false));
    } catch (error) {
      console.log('Forgot error: ', error);
      flashMessage('Error!', 'Opps! Something is wrong.', 'warning');
    }
  };

  return (
    <View style={styles.root}>
      <Header isBack title={'Forgot Password'} center />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, padding: 20}}
        bounces={false}>
        {/* <TouchableOpacity onPress={navigation.goBack}>
            <Image source={assets.backArrow} style={styles.backIc} />
          </TouchableOpacity> */}

        <View style={{flex: 1}}>
          {/* <View style={{height: moderateScale(40)}} />
            <Text style={styles.title}>Forgot Password</Text> */}
          <View style={{height: moderateScale(40)}} />
          <Input
            title="Email id"
            placeholder="type here"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={{height: moderateScale(40)}} />
          <Button title="Submit" onPress={_submit} />
        </View>
      </KeyboardAwareScrollView>
      {/* <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 1,
              backgroundColor: colors.white,
              marginRight: -1,
              height: '100%',
              zIndex: 1,
            }}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={{color: colors.primary}}
                onPress={() => navigation.navigate('login')}>
                {' '}
                Sign In{' '}
              </Text>
            </Text>
          </View>
          <View
            style={{
              width: 1,
              backgroundColor: colors.white,
              marginLeft: -1,
              height: '100%',
              zIndex: 1,
            }}
          />
        </View>
        <View style={styles.hideBottomBorder} /> */}
    </View>
  );
}

export default ForgotPassword;

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
  title: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(18),
    color: colors.black,
    textAlign: 'center',
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
  hideBottomBorder: {
    height: 1,
    backgroundColor: colors.white,
    marginTop: -1,
  },
});

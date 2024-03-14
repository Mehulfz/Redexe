import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {flashMessage, rootLoader, userRegister} from '../../actions';
import {Button} from '../../components/Buttons';
import Header from '../../components/Header';
import {Input} from '../../components/Inputs';
import {REGISTER_OTP_TYPE} from '../../constants';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate} from '../../navigation/RootNavigation';
import { phonenumberValidate } from '../../utils/arrayOperations';

function SignUp({navigation}) {
  const dispatch = useDispatch();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const _submit = async () => {
    try {
      if (!fname?.trim()) {
        return flashMessage('Required!', 'Please enter first name.', 'warning');
      } else if (!lname?.trim()) {
        return flashMessage('Required!', 'Please enter last name.', 'warning');
      } else if (!email?.trim()) {
        return flashMessage(
          'Required!',
          'Please enter email address.',
          'warning',
        );
      } else if (!phonenumberValidate(phone)) {
        return flashMessage(
          'Required!',
          'Please enter valid phone number.',
          'warning',
        );
      } else if (!password?.trim()) {
        return flashMessage('Required!', 'Please enter password.', 'warning');
      }

      const request = {
        first_name: fname,
        last_name: lname,
        email: email,
        phone_number: phone,
        password,
      };
      dispatch(rootLoader(true));
      const {status} = await dispatch(userRegister(request));
      dispatch(rootLoader(false));
      if (status) {
        navigate('accountVerification', {
          data: {
            email_or_phone: phone,
            type: REGISTER_OTP_TYPE,
          },
        });
      }
    } catch (error) {
      console.log('Login error: ', error);
      flashMessage('Error!', 'Opps! Something is wrong.', 'warning');
    }
  };

  return (
    <View style={styles.root}>
      <Header isBack title={'Register'} center />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, padding: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={{height: 10}} />
        <Input
          title="First Name"
          placeholder="type here"
          value={fname}
          onChangeText={setFname}
        />
        <View style={{height: 15}} />
        <Input
          title="Last Name"
          placeholder="type here"
          value={lname}
          onChangeText={setLname}
        />
        <View style={{height: 15}} />
        <Input
          title="Email address"
          placeholder="type here"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View style={{height: 15}} />
        <Input
          title="Phone number"
          placeholder="type here"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="done"
          maxLength={10}
        />
        <View style={{height: 15}} />
        <Input
          title="Password"
          placeholder="type here"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View
          style={{
            marginHorizontal: moderateScale(50),
            marginTop: moderateScale(30),
            marginBottom: moderateScale(20),
          }}>
          <Button title="Sign Up" onPress={_submit} />
        </View>
      </KeyboardAwareScrollView>

      <SafeAreaView />
    </View>
  );
}

export default SignUp;

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
});

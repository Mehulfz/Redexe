import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {
  changeAccountPassword,
  flashMessage,
  forgotPasswordByEmail,
  mobileVerify,
  rootLoader,
  sendMobileOtp,
  userLogin,
} from '../../../actions';
import assets from '../../../assets';
import {Button} from '../../../components/Buttons';
import Header from '../../../components/Header';
import {Input} from '../../../components/Inputs';
import colors from '../../../constants/colors';
import env from '../../../constants/env';

function ChangePassword({navigation, route}) {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const _submit = async () => {
    try {
      if (!currentPassword?.trim())
        return flashMessage(
          'Required!',
          'Please enter current password.',
          'warning',
        );
      else if (!newPassword?.trim())
        return flashMessage(
          'Required!',
          'Please enter new password.',
          'warning',
        );
      else if (!confirmPassword?.trim())
        return flashMessage(
          'Required!',
          'Please enter confirmation password.',
          'warning',
        );
      else if (newPassword !== confirmPassword)
        return flashMessage(
          'Required!',
          'New password and confirm password both must be same.',
          'warning',
        );

      dispatch(
        changeAccountPassword({
          current_password: currentPassword,
          new_password: newPassword,
          new_confirm_password: confirmPassword,
        }),
      );
    } catch (error) {
      console.log('Forgot error: ', error);
      flashMessage('Error!', 'Opps! Something is wrong.', 'warning');
    }
  };

  return (
    <View style={styles.root}>
      <Header
        title="Change Password"
        center
        leadAction={
          <TouchableOpacity onPress={navigation.goBack} style={{padding: 15}}>
            <Image
              source={assets.backArrow}
              style={{resizeMode: 'contain', height: 25, width: 25}}
            />
          </TouchableOpacity>
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, padding: 20}}>
        <View style={{flex: 1}}>
          <Input
            title="Current Password"
            placeholder="type here"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <View style={{height: 15}} />
          <Input
            title="New Password"
            placeholder="type here"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <View style={{height: 15}} />
          <Input
            title="Confirm New Password"
            placeholder="type here"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={{height: 40}} />
          <Button title="Submit" onPress={_submit} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default ChangePassword;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

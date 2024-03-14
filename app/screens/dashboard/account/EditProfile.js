import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {flashMessage, getStateList, updateProfile} from '../../../actions';
import assets from '../../../assets';
import {Button} from '../../../components/Buttons';
import Header from '../../../components/Header';
import {Input, InputSelection} from '../../../components/Inputs';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import {phonenumberValidate} from '../../../utils/arrayOperations';

export default function EditProfile({navigation}) {
  const dispatch = useDispatch();
  const {stateList} = useSelector(({meta}) => meta);
  const {currentUser} = useSelector(({user}) => user);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [gender, setGender] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [atlPhone, setAtlPhone] = useState('');

  useEffect(() => {
    if (!stateList?.length) dispatch(getStateList());
    console.log(currentUser);
    setFname(currentUser?.first_name);
    setLname(currentUser?.last_name);
    setGender(currentUser?.gender);
    setAddress1(currentUser?.address1);
    setAddress2(currentUser?.address2);
    setCity(currentUser?.city);
    setState(currentUser?.state_data);
    setPin(String(currentUser?.pin_code));
    setPhone(String(currentUser?.phone_number));
    setAtlPhone(String(currentUser?.alt_phone_number));
  }, [currentUser]);

  const _submit = async () => {
    try {
      if (!phonenumberValidate(phone))
        return flashMessage(
          'Required!',
          'Please valid mobile number.',
          'warning',
        );

      const request = {
        first_name: fname,
        last_name: lname,
        gender,
        address1,
        address2,
        city,
        state: state.id,
        pin_code: pin,
        phone_number: phone,
        alternate_phone_number: atlPhone,
      };
      await dispatch(updateProfile(request));
    } catch (error) {
      console.log('Profile error: ', error);
      flashMessage('Error!', 'Opps! Something is wrong.', 'warning');
    }
  };

  const disabled =
    !fname ||
    !lname ||
    !gender ||
    !address1 ||
    !address2 ||
    !city ||
    !state ||
    !pin ||
    !phone;

  return (
    <View style={styles.root}>
      <Header
        title={'Edit Personal Details'}
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
        contentContainerStyle={{flexGrow: 1, padding: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1 / 2}}>
            <Input
              title="First Name"
              placeholder="type here"
              value={fname}
              onChangeText={setFname}
            />
          </View>
          <View style={{width: moderateScale(15)}} />
          <View style={{flex: 1 / 2}}>
            <Input
              title="Last Name"
              placeholder="type here"
              value={lname}
              onChangeText={setLname}
            />
          </View>
        </View>
        <View style={{height: 15}} />
        <Text style={styles.inputTitle}>Gender :</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => setGender('Male')}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {gender === 'Male' ? (
                <View style={styles.radioFillCircle} />
              ) : null}
            </View>
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>
          <View style={{width: moderateScale(15)}} />
          <TouchableOpacity
            onPress={() => setGender('Female')}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {gender === 'Female' ? (
                <View style={styles.radioFillCircle} />
              ) : null}
            </View>
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 15}} />
        <Input
          title={'Address Line1:'}
          value={address1}
          onChangeText={setAddress1}
        />
        <View style={{height: moderateScale(15)}} />
        <Input
          title={'Line2 Address:'}
          value={address2}
          onChangeText={setAddress2}
        />
        <View style={{flexDirection: 'row', marginTop: moderateScale(15)}}>
          <View style={{flex: 1 / 2}}>
            <Input
              title={'City:'}
              placeholder={'Enter city'}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={{width: moderateScale(15)}} />
          <View style={{flex: 1 / 2}}>
            <Input
              title={'Pin Code:'}
              placeholder={'Enter pincode'}
              value={pin}
              onChangeText={setPin}
            />
          </View>
        </View>
        <View style={{height: moderateScale(15)}} />
        <InputSelection
          title="State"
          placeholder="Select state"
          value={state?.name || ''}
          options={stateList}
          onChangeText={setState}
        />
        <View style={{height: 15}} />
        <Input
          title="Contact Number"
          placeholder="type here"
          keyboardType="phone-pad"
          returnKeyType="done"
          value={phone}
          onChangeText={setPhone}
        />
        <View style={{height: 15}} />
        <Input
          title="Alternate Contact Number"
          placeholder="type here"
          keyboardType="phone-pad"
          returnKeyType="done"
          value={atlPhone}
          onChangeText={setAtlPhone}
        />
        <View style={{height: moderateScale(30)}} />
        <Button
          title="Modify Profile"
          onPress={_submit}
          disabled={disabled}
          containerStyle={{
            backgroundColor: disabled ? colors.Gray : colors.primary,
          }}
        />
        <View style={{height: moderateScale(30)}} />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inputTitle: {
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(15),
    marginBottom: moderateScale(12),
  },
  radioText: {
    color: colors.black,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },
  radioRow: {
    flex: 1 / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    borderWidth: moderateScale(1.5),
    borderColor: colors.primary,
    borderRadius: moderateScale(18),
    width: moderateScale(18),
    height: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFillCircle: {
    backgroundColor: colors.primary,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(15),
  },
});

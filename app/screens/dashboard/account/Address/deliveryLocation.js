import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {addAddress, getStateList, flashMessage} from '../../../../actions';
import {Button} from '../../../../components/Buttons';
import Header from '../../../../components/Header';
import {InputSelectionV2, InputV2} from '../../../../components/Inputs';
import colors from '../../../../constants/colors';
import env from '../../../../constants/env';
import {phonenumberValidate} from '../../../../utils/arrayOperations';

export default function DeliveryLocation({navigation, route}) {
  const {editData, onAdded} = route.params || {};
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const {stateList} = useSelector(({meta}) => meta);
  const {currentUser} = useSelector(({user}) => user);

  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');

  const [type, setType] = useState('Home');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setName(currentUser?.first_name + ' ' + currentUser?.last_name);
    setPhone(currentUser?.phone_number);
    if (!stateList?.length) {
      dispatch(getStateList());
    }
  }, []);

  useEffect(() => {
    if (editData) {
      setName(editData?.name);
      setAddress1(editData?.address1);
      setAddress2(editData?.address2);
      setLandmark(editData?.landmark);
      setCity(editData?.city);
      setState(editData?.state);
      setPin(String(editData?.pin_code));
      setPhone(String(editData?.phone_number));

      if (editData?.title !== 'Home' && editData?.title !== 'Work') {
        setType('other');
        setTitle(editData?.title);
      } else {
        setType(editData?.title);
      }
    }
  }, []);

  const _submit = async () => {
    if (!phonenumberValidate(phone)) {
      return flashMessage('Enter valid phone number!', '', 'warning');
    } else if (pin?.length !== 6) {
      return flashMessage('Enter valid pincode!', '', 'warning');
    }

    const request = {
      title: type === 'other' ? title : type,
      name,
      address1,
      address2,
      landmark,
      city,
      state_id: state.id,
      pin_code: pin,
      country: 'India',
      phone_number: phone,
    };
    if (editData?.id) {
      request.manage_address_id = editData.id;
    }
    let res = await dispatch(addAddress(request));
    if (res.status) {
      console.log('res.data', res.data);
      if (onAdded) onAdded(res.data);
      navigation.goBack();
    }
  };

  const disabled =
    !name ||
    !address1 ||
    !address2 ||
    !city ||
    !state ||
    !pin ||
    !phone ||
    !type ||
    (type === 'other' && !title);

  const renderTitle = () => {
    return (
      <View>
        <Text style={styles.inputTitle}>Select</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setType('Home')}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {type === 'Home' ? <View style={styles.radioFillCircle} /> : null}
            </View>
            <Text style={styles.radioText}>Home</Text>
          </TouchableOpacity>
          <View style={{width: moderateScale(15)}} />
          <TouchableOpacity
            onPress={() => setType('Work')}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {type === 'Work' ? <View style={styles.radioFillCircle} /> : null}
            </View>
            <Text style={styles.radioText}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('other')}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {type === 'other' ? (
                <View style={styles.radioFillCircle} />
              ) : null}
            </View>
            <Text style={styles.radioText}>Other</Text>
          </TouchableOpacity>
        </View>
        {type === 'other' ? (
          <InputV2 title="Title" value={title} onChangeText={setTitle} />
        ) : null}
      </View>
    );
  };
  return (
    <View style={styles.root}>
      <Header title="Add new address" center isBack />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        {renderTitle()}
        <View style={{height: ms(10)}} />
        <InputV2 title={'Name:'} value={name} onChangeText={setName} />
        <View style={{height: ms(10)}} />
        <InputV2
          title="Phone Number:"
          value={'+91' + phone}
          onChangeText={(formatted, extracted) => setPhone(extracted)}
          keyboardType="phone-pad"
          returnKeyType="done"
          mask={'+91[0000000000]'}
        />

        <View style={{height: ms(10)}} />
        <InputV2
          title={'Building / Apartment:'}
          value={address1}
          onChangeText={setAddress1}
        />
        <View style={{height: ms(10)}} />
        <InputV2
          title={'Address:'}
          value={address2}
          onChangeText={setAddress2}
        />
        <View style={{height: ms(10)}} />
        <InputV2
          title={'Landmark:'}
          value={landmark}
          onChangeText={setLandmark}
        />
        <View style={{height: ms(10)}} />
        <InputV2 title={'City:'} value={city} onChangeText={setCity} />
        <View style={{height: ms(10)}} />
        <InputV2
          title={'Pin Code:'}
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          mask={'[000000]'}
          returnKeyType="done"
        />
        <View style={{height: ms(10)}} />

        <InputSelectionV2
          title="State"
          value={state?.name || ''}
          options={stateList}
          onChangeText={setState}
        />
        <View style={{height: moderateScale(20)}} />
        <Button
          title={'Submit'}
          onPress={_submit}
          disabled={disabled}
          containerStyle={{
            marginHorizontal: ms(20),
            backgroundColor: disabled ? colors.Gray : colors.primary,
          }}
        />
        <View style={{height: bottom}} />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backIc: {
    resizeMode: 'contain',
    height: moderateScale(25),
    width: moderateScale(25),
  },
  contentContainerStyle: {
    padding: moderateScale(15),
  },
  inputTitle: {
    color: colors.black,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(16),
    marginBottom: ms(5),
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(10),
    marginBottom: ms(20),
  },
  radioText: {
    color: colors.black,
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    marginLeft: ms(10),
  },
  radioRow: {
    flex: 1 / 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: ms(20),
    width: ms(20),
    height: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFillCircle: {
    backgroundColor: colors.primary,
    width: ms(12),
    height: ms(12),
    borderRadius: ms(12),
  },
});

import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {getStateList} from '../../actions';
import assets from '../../assets';
import {Input, InputSelection} from '../../components/Inputs';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Button} from '../Buttons';

export const AddressFormDialog = ({isVisible, onClose, onSubmit}) => {
  const dispatch = useDispatch();
  const {stateList} = useSelector(({meta}) => meta);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');

  const _submit = () => {
    onSubmit({
      fname,
      lname,
      name: fname + ' ' + lname,
      address1,
      address2,
      city,
      state,
      pin_code: pin,
      phone_number: phone,
    });
    onClose();
  };

  useEffect(() => {
    if (!stateList?.length) dispatch(getStateList());
  }, []);

  const disabled =
    !fname ||
    !lname ||
    !address1 ||
    !address2 ||
    !city ||
    !state ||
    !pin ||
    !phone;

  return (
    <Modal
      isVisible={isVisible}
      // onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.root}>
      <View style={styles.contain}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>+ Add address</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1 / 2}}>
            <Input
              title="First Name"
              placeholder="First Name"
              value={fname}
              onChangeText={setFname}
            />
          </View>
          <View style={{width: ms(15)}} />
          <View style={{flex: 1 / 2}}>
            <Input
              title="Last Name"
              placeholder="Last Name"
              value={lname}
              onChangeText={setLname}
            />
          </View>
        </View>
        <View style={{height: 15}} />
        <Input
          title={'Address Line1:'}
          placeholder="Address Line 1"
          value={address1}
          onChangeText={setAddress1}
        />
        <View style={{height: ms(15)}} />
        <Input
          title={'Line2 Address:'}
          placeholder="Address Line 2"
          value={address2}
          onChangeText={setAddress2}
        />
        <View style={{flexDirection: 'row', marginTop: ms(15)}}>
          <View style={{flex: 1 / 2}}>
            <Input
              title={'City:'}
              placeholder={'Enter city'}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={{width: ms(15)}} />
          <View style={{flex: 1 / 2}}>
            <Input
              title={'Pin Code:'}
              placeholder={'Enter pincode'}
              value={pin}
              onChangeText={setPin}
            />
          </View>
        </View>
        <View style={{height: ms(15)}} />
        <InputSelection
          title="State"
          placeholder="Select state"
          value={state?.name || ''}
          options={stateList}
          onChangeText={setState}
        />
        <View style={{height: ms(15)}} />
        <Input
          title={'Contact No:'}
          placeholder="Enter contact no."
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="done"
        />
        <View style={{height: ms(25)}} />
        <Button
          title={'Submit'}
          onPress={_submit}
          disabled={disabled}
          containerStyle={disabled && {backgroundColor: colors.Gray}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: ms(5),
  },
  contain: {
    backgroundColor: colors.white,
    padding: ms(15),
    borderRadius: ms(10),
  },
  modalHeader: {
    marginBottom: ms(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: colors.black,
    fontFamily: env.fontMedium,
    fontSize: ms(16),
  },
  closeIc: {
    height: ms(14),
    width: ms(14),
    resizeMode: 'contain',
  },
  inputTitle: {
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: ms(15),
    marginBottom: ms(12),
  },
});

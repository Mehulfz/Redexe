/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, ms} from 'react-native-size-matters';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Button} from '../Buttons';
import {Input} from '../Inputs';

export function AddGSTDialog({isVisible, onClose, data, onSubmit}) {
  const {bottom} = useSafeAreaInsets();
  const [gst, setGST] = useState(data?.gst_no || '');
  const [name, setName] = useState(data?.company_name || '');

  const _submit = async () => {
    onClose();
    let tmpArr = data || {};
    tmpArr.gst_no = gst;
    tmpArr.company_name = name;
    onSubmit(tmpArr);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      backdropOpacity={0.5}
      avoidKeyboard>
      <View style={styles.root}>
        <SafeAreaView />
        <Text style={styles.title}>{data ? 'Edit' : 'Add'} GST Details</Text>
        <Input
          value={name}
          onChangeText={setName}
          containStyle={styles.input}
          placeholder="Business name"
        />
        <Input
          value={gst}
          onChangeText={setGST}
          containStyle={styles.input}
          placeholder="Enter GSTIN"
        />
        <View style={{height: moderateScale(20)}} />
        <View style={styles.footer}>
          <Button
            title={'Cancel'}
            containerStyle={styles.btnOutline}
            titleStyle={{...styles.btnText, color: colors.black}}
            onPress={onClose}
          />
          <View style={{width: ms(10)}} />
          <Button
            title={'Submit'}
            containerStyle={styles.btn}
            titleStyle={styles.btnText}
            onPress={_submit}
            disabled={!name || !gst}
          />
        </View>
        <View style={{height: bottom}} />
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
  title: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.black,
    marginTop: moderateScale(10),
  },
  input: {
    borderRadius: moderateScale(5),
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

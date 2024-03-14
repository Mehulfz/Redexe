import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {addBankDetails, addUIPDetails, getStateList} from '../../../../actions';
import {Button} from '../../../../components/Buttons';
import Header from '../../../../components/Header';
import {Input, InputSelection} from '../../../../components/Inputs';
import colors from '../../../../constants/colors';

export default function AddRefundPayment({route}) {
  const {type, editData} = route.params || {};
  const dispatch = useDispatch();
  const {stateList} = useSelector(({meta}) => meta);

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [IFSC, setIFSC] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [UPIName, setUPIName] = useState('');
  const [UPINumber, setUPINumber] = useState('');

  useEffect(() => {
    if (!stateList?.length) dispatch(getStateList());
    if (type == 'upi' && editData) {
      setUPIName(editData?.upi_name);
      setUPINumber(editData?.upi_number);
    }
    if (type == 'bank' && editData) {
      setBankName(editData?.bank_name);
      setAccountNumber(String(editData?.account_number));
      setConfirmAccountNumber(String(editData?.account_number));
      setIFSC(editData?.ifsc);
      setBranch(editData?.branch);
      setCity(editData?.city);
      setState(editData?.state_data);
    }
  }, []);

  const _submitBank = () => {
    const request = {
      bank_name: bankName,
      account_number: accountNumber,
      account_number_confirmation: confirmAccountNumber,
      ifsc: IFSC,
      branch: branch,
      city,
      state: state.id,
    };
    if (editData) request.refund_payment_id = editData.id;
    dispatch(addBankDetails(request));
  };

  const _submitUPI = () => {
    const request = {
      upi_name: UPIName,
      upi_number: UPINumber,
    };
    if (editData) request.refund_payment_id = editData.id;
    dispatch(addUIPDetails(request));
  };

  const renderBankForm = () => {
    if (type !== 'bank') return null;
    const disabled =
      !bankName ||
      !accountNumber ||
      !confirmAccountNumber ||
      accountNumber != confirmAccountNumber ||
      !IFSC ||
      !branch ||
      !city ||
      !state;

    return (
      <View style={styles.form}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Input
            title={'Bank name:'}
            placeholder={'Enter bank name'}
            value={bankName}
            onChangeText={setBankName}
          />
          <View style={{height: moderateScale(15)}} />
          <Input
            title={'Account number:'}
            placeholder={'Enter account number'}
            keyboardType="phone-pad"
            returnKeyType="done"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
          <View style={{height: moderateScale(15)}} />
          <Input
            title={'Confirm Account number:'}
            placeholder={'Re-confirm account number'}
            keyboardType="phone-pad"
            returnKeyType="done"
            value={confirmAccountNumber}
            onChangeText={setConfirmAccountNumber}
          />
          <View style={{height: moderateScale(15)}} />
          <Input
            title={'IFSC:'}
            placeholder={'Enter IFSC'}
            value={IFSC}
            onChangeText={setIFSC}
          />
          <View style={{height: moderateScale(15)}} />
          <Input
            title={'Branch:'}
            placeholder={'Enter branch name'}
            value={branch}
            onChangeText={setBranch}
          />
          <View style={{height: moderateScale(15)}} />
          <Input
            title={'City:'}
            placeholder={'Enter city name'}
            value={city}
            onChangeText={setCity}
          />
          <View style={{height: moderateScale(15)}} />
          <InputSelection
            title="State"
            placeholder={'Select state'}
            value={state?.name || ''}
            options={stateList}
            onChangeText={setState}
          />

          <View style={styles.btnContainer}>
            <Button
              title={editData ? 'Save' : 'Add Bank Details'}
              disabled={disabled}
              onPress={_submitBank}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  const renderUPIForm = () => {
    if (type != 'upi') return null;
    const disabled = !UPIName || !UPINumber;
    return (
      <View style={styles.form}>
        <Input
          title={'UPI Name :'}
          placeholder={'Enter UPI Name'}
          value={UPIName}
          onChangeText={setUPIName}
        />
        <View style={{height: moderateScale(15)}} />
        <Input
          title={'UPI Number :'}
          placeholder={'Enter UPI Number'}
          value={UPINumber}
          onChangeText={setUPINumber}
        />
        <View style={styles.btnContainer}>
          <Button
            title={editData ? 'Save' : 'Add UPI Details'}
            disabled={disabled}
            onPress={_submitUPI}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header title={'Add refund payments'} isBack />
      {renderBankForm()}
      {renderUPIForm()}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  form: {
    flex: 1,
    padding: moderateScale(20),
  },
  btnContainer: {
    marginHorizontal: moderateScale(60),
    marginVertical: moderateScale(30),
  },
});

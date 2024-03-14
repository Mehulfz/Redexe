import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import Modal from 'react-native-modal';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {disputeRequest} from '../../actions';
import {updateOrderState} from '../../actions/order';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Input} from '../Inputs';

export const RequestForReturnReplaceModal = () => {
  const dispatch = useDispatch();
  const {orderActionProduct, showRequestForReturnReplaceModal} = useSelector(
    (state) => state.order,
  );
  const {cancelReasonList} = useSelector((state) => state.meta);
  const [reason, setReason] = useState();
  const [amount, setAmount] = useState('');
  const [loader, setLoader] = useState();
  const flashRef = useRef();
  const {stateList} = useSelector(({meta}) => meta);
  const {currentUser} = useSelector(({user}) => user);
  const [requestType, setRequestType] = useState(1);
  const [amountType, setAmountType] = useState('');

  const onClose = () => {
    dispatch(updateOrderState('showRequestForReturnReplaceModal', false));
  };

  const onModalHide = () => {
    setReason();
    setLoader(false);
  };

  const showFlashMessage = (message, description, type) => {
    flashRef.current.showMessage({
      message,
      description,
      type,
      icon: type,
    });
  };

  const _submit = async () => {
    if (!reason)
      return showFlashMessage(
        'Required!',
        'Select order cancellation reason.',
        'warning',
      );

    const request = {
      user_order_products_id:
        orderActionProduct?.user_order_product[0]?.user_order_products_id,
      request_type: requestType,
      refund_type: amountType === 1 ? 'full' : 'partial',
      request_reason: reason,
    };
    if (requestType === 2) {
      if (!amountType)
        return showFlashMessage('Required!', 'Select refund type.', 'warning');
      if (amountType === 2) {
        if (!amount)
          return showFlashMessage(
            'Required!',
            'Enter refund amount.',
            'warning',
          );
        request.refund_amount = amount;
      }
    }

    setLoader(true);
    let res = await dispatch(disputeRequest(request));
    setLoader(false);
    onClose();
  };

  const renderAmount = () => {
    if (requestType !== 2) return null;
    return (
      <>
        <Text style={styles.inputTitle}>Refund amount :</Text>
        <TouchableOpacity
          onPress={() => setAmountType(1)}
          style={styles.radioRow}>
          <View style={styles.radioCircle}>
            {amountType === 1 ? <View style={styles.radioFillCircle} /> : null}
          </View>
          <Text style={styles.radioText}>Refund full amount</Text>
        </TouchableOpacity>
        <View style={{width: moderateScale(15)}} />
        <TouchableOpacity
          onPress={() => setAmountType(2)}
          style={styles.radioRow}>
          <View style={styles.radioCircle}>
            {amountType === 2 ? <View style={styles.radioFillCircle} /> : null}
          </View>
          <Text style={styles.radioText}>Refund partial amount</Text>
        </TouchableOpacity>
        {amountType === 2 ? (
          <>
            <Input placeholder="INR" value={amount} onChangeText={setAmount} />
            <Text style={styles.betweenINRText}>
              Please enter an amount between INR 0.01-100
            </Text>
          </>
        ) : null}
      </>
    );
  };

  return (
    <Modal
      isVisible={showRequestForReturnReplaceModal}
      onModalHide={onModalHide}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create return/exchange reqeust</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>
        <Text style={styles.inputTitle}>Request Type :</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => setRequestType(1)}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {requestType === 1 ? (
                <View style={styles.radioFillCircle} />
              ) : null}
            </View>
            <Text style={styles.radioText}>Exchange</Text>
          </TouchableOpacity>
          <View style={{width: moderateScale(15)}} />
          <TouchableOpacity
            onPress={() => setRequestType(2)}
            style={styles.radioRow}>
            <View style={styles.radioCircle}>
              {requestType === 2 ? (
                <View style={styles.radioFillCircle} />
              ) : null}
            </View>
            <Text style={styles.radioText}>Refund/Return</Text>
          </TouchableOpacity>
        </View>
        {renderAmount()}
        <View style={{height: ms(20)}} />
        <Input
          title={'Return/Exchange Reason*'}
          placeholder="Write reason for return or exchange"
          value={reason}
          onChangeText={setReason}
          multiline={true}
        />

        {loader ? (
          <View style={{height: moderateScale(50), justifyContent: 'center'}}>
            <ActivityIndicator style={{alignSelf: 'center'}} />
          </View>
        ) : (
          <View style={styles.itemActionContain}>
            <TouchableOpacity style={[styles.itemActionBtn]} onPress={_submit}>
              <Text style={styles.itemActionText}>Create Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlashMessage ref={flashRef} position="top" />
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: env.fontSemibold,
  },
  closeIc: {
    resizeMode: 'contain',
    height: moderateScale(13),
    width: moderateScale(13),
  },
  contain: {
    flexDirection: 'row',
    marginVertical: moderateScale(15),
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(12),
    color: colors.black,
    marginBottom: moderateScale(3),
  },
  itemImg: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: 10,
    marginRight: 10,
  },
  statusText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(11),
    color: colors.primary,
    marginBottom: moderateScale(3),
  },
  infoMsg: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.darkGray,
    marginBottom: moderateScale(20),
  },
  itemActionContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: moderateScale(20),
  },
  itemActionBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
    marginLeft: moderateScale(20),
  },
  itemActionText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.white,
  },
  inputTitle: {
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(15),
    marginBottom: moderateScale(12),
    marginTop: ms(20),
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
  radioText: {
    color: colors.black,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },
  betweenINRText: {
    fontSize: ms(13),
    color: colors.darkGray,
    marginTop: ms(10),
  },
});

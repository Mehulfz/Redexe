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
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {extendOrderProcessingTime, updateOrderState} from '../../actions/order';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Input} from '../Inputs';

export const ExtendProcessingModal = () => {
  const dispatch = useDispatch();
  const {orderActionProduct, showExtendProcessingModal} = useSelector(
    (state) => state.order,
  );
  const [days, setDays] = useState();
  const [loader, setLoader] = useState();
  const flashRef = useRef();

  const onModalHide = () => {
    setDays();
    setLoader(false)
  };

  const onClose = () => {
    dispatch(updateOrderState('showExtendProcessingModal', false));
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
    if (!days)
      return showFlashMessage(
        'Required!',
        'Enter extending processing Day',
        'warning',
      );
    setLoader(true);
    let res = await dispatch(
      extendOrderProcessingTime({
        user_order_products_id: orderActionProduct?.user_order_product[0]?.user_order_products_id,
        days,
      }),
    );
    setLoader(false);
    // if (!res?.status) {
    //   return showFlashMessage('Error!', res?.message, 'danger');
    // }
    onClose();
  };

  return (
    <Modal isVisible={showExtendProcessingModal} onModalHide={onModalHide}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Extend Processing Day</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>

        <Text style={styles.infoMsg}>
          If the supplier has an issue for processing this order, then you can
          extend the time for the seller to prepare the products.
        </Text>
        <Input
          title={'Extending Processing Day :'}
          placeholder="Enter extending processing Day"
          value={days}
          onChangeText={setDays}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        {loader ? (
          <View style={{height: moderateScale(50), justifyContent: 'center'}}>
            <ActivityIndicator style={{alignSelf: 'center'}} />
          </View>
        ) : (
          <View style={styles.itemActionContain}>
            <TouchableOpacity style={styles.itemActionBtn} onPress={_submit}>
              <Text style={styles.itemActionText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemActionBtn, {backgroundColor: colors.red}]}
              onPress={onClose}>
              <Text style={styles.itemActionText}>Cancel</Text>
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
  infoMsg: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.darkGray,
    marginVertical: moderateScale(20),
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
});

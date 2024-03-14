import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
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
import {getCancelReason} from '../../actions/meta';
import {cancelOrderProduct, updateOrderState} from '../../actions/order';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Input, InputSelection} from '../Inputs';

export const CancelOrderModal = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const {orderActionProduct, showCancelOrderModal} = useSelector(
    state => state.order,
  );
  const {cancelReasonList} = useSelector(state => state.meta);
  const [reason, setReason] = useState();
  const [otherText, setOtherText] = useState('');
  const [loader, setLoader] = useState();
  const flashRef = useRef();
  useEffect(() => {
    if (!cancelReasonList?.length) dispatch(getCancelReason());
  }, []);

  const onClose = () => {
    dispatch(updateOrderState('showCancelOrderModal', false));
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
    if (!reason?.name) {
      return showFlashMessage(
        'Required!',
        'Select order cancellation reason.',
        'warning',
      );
    }

    setLoader(true);
    let res = await dispatch(
      cancelOrderProduct({
        user_order_products_id:
          orderActionProduct?.user_order_product[0]?.user_order_products_id,
        cancel_order_reason:
          reason?.name === 'Other' ? otherText : reason?.name,
      }),
    );
    setLoader(false);
    if (res?.status) {
      if (route.params?.refresh) {
        route.params?.refresh();
      }
    }
    // if (!res?.status) {
    //   return showFlashMessage('Warning!', res?.message, 'warning');
    // }
    onClose();
  };

  return (
    <Modal isVisible={showCancelOrderModal} onModalHide={onModalHide}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cancel Order</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>

        <View style={{height: ms(20)}} />
        <InputSelection
          title={'Order Cancellation Reason :'}
          placeholder="Select order cancellation reason"
          options={cancelReasonList}
          value={reason?.name}
          onChangeText={setReason}
        />
        {reason?.name === 'Other' ? (
          <>
            <View style={{height: ms(20)}} />
            <Input
              title={'Reason'}
              placeholder="Enter reason"
              value={otherText}
              onChangeText={setOtherText}
            />
          </>
        ) : null}

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
});

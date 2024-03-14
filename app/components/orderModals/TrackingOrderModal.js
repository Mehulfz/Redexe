import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {updateOrderState} from '../../actions/order';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {OrderStatusIndicator} from '../OrderStatusIndicator';

export const TrackingOrderModal = () => {
  const dispatch = useDispatch();
  const {trackingDetails, showTrackingOrderModal} = useSelector(
    (state) => state.order,
  );

  if (!trackingDetails?.length) return null;

  const onClose = () => {
    dispatch(updateOrderState('showTrackingOrderModal', false));
  };

  const onModalHide = () => {
    dispatch(updateOrderState('trackingDetails', []));
  };

  var shipping;
  var indicatorLabels = trackingDetails?.map((x) => {
    if (x.status_id == 2) shipping = x?.user_order_shipping;
    return x.status;
  });
  indicatorLabels = indicatorLabels?.reverse();

  return (
    <Modal isVisible={showTrackingOrderModal} onModalHide={onModalHide}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order tracking information</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>
        <View style={{height: moderateScale(15)}} />
        {shipping && shipping?.tracking_id ? (
          <>
            <Text style={styles.trackingItemText}>
              Tracking Number : {shipping?.tracking_id}
            </Text>
            <Text style={styles.trackingItemText}>
              Logistic company : {shipping?.shipping_carrier}
            </Text>
            <Text style={styles.trackingItemText}>
              Shipment Date :{' '}
              {moment(shipping?.shipped_date).format(
                'Do, MMMM YYYY [at] hh:mma',
              )}
            </Text>
          </>
        ) : null}
        <OrderStatusIndicator
          indicatorIndex={trackingDetails?.length - 1}
          labels={indicatorLabels}
        />
      </View>
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
  trackingItemText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: '#87879D',
    marginVertical: moderateScale(4),
  },
});

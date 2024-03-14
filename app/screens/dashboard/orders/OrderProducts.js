import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {moderateScale} from 'react-native-size-matters';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import {useDispatch, useSelector} from 'react-redux';
import {updateOrderState, getOrderTracking} from '../../../actions/order';
import {
  CancelOrderModal,
  ExtendProcessingModal,
  TrackingOrderModal,
} from '../../../components/orderModals';
import OrderFeedbackModal from '../../../components/Modals/OrderFeedbackModal';

export default function OrderProducts({data}) {
  const dispatch = useDispatch();
  const {orderActionProduct} = useSelector((state) => state.order);
  const [feedbackModalVisible, showFeedbackModalVisible] = useState(false);

  const _cancelProduct = (item) => {
    dispatch(updateOrderState('orderActionProduct', item));
    dispatch(updateOrderState('showCancelOrderModal', true));
  };

  const _extendProcessing = (item) => {
    dispatch(updateOrderState('orderActionProduct', item));
    dispatch(updateOrderState('showExtendProcessingModal', true));
  };

  const _trackingOrder = async (item) => {
    let res = await dispatch(
      getOrderTracking({user_order_products_id: item?.user_order_products_id}),
    );
    if (res?.status) dispatch(updateOrderState('showTrackingOrderModal', true));
  };

  const _writeReview = (item) => {
    dispatch(updateOrderState('orderActionProduct', item));
    showFeedbackModalVisible(true);
  };

  const _disputeProduct = (item) => {};

  const renderItem = (item, index) => {
    return (
      <View style={styles.item} key={String(index)}>
        <View style={styles.itemContainer} key={String(index)}>
          <Image style={styles.itemImg} source={{uri: item?.product_image}} />
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item?.product_name}
              </Text>
            </View>
            {item?.size || item?.color ? (
              <Text style={styles.statusText}>
                {item?.size ? `Size : ${item?.size}` : null}
                {item?.color && item?.size ? '  |  ' : ''}
                {item?.color ? `Color : ${item?.color}` : null}
              </Text>
            ) : null}

            <Text style={styles.statusText}>
              Store : {item?.store?.DisplayName}{' '}
            </Text>
            <Text style={styles.productItemPrice}>
              Rs. {item?.sub_total}
              {`  |  `}Qty. {item?.quantity}
              {/* {`  |  `}
              <Text style={{color: colors.blue}}>{item?.status}</Text> */}
            </Text>
          </View>
        </View>

        <View style={styles.itemActionContain}>
          {item?.status_id == 0 || item?.status_id == 1 ? (
            <TouchableOpacity
              style={[styles.itemActionBtn, {backgroundColor: colors.red}]}
              onPress={() => _cancelProduct(item)}>
              <Text style={styles.itemActionText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
          {item?.status_id == 1 ? (
            <TouchableOpacity
              style={styles.itemActionBtn}
              onPress={() => _extendProcessing(item)}>
              <Text style={styles.itemActionText}>Extend time</Text>
            </TouchableOpacity>
          ) : null}
          {item?.status_id == 2 ? (
            <TouchableOpacity
              style={styles.itemActionBtn}
              onPress={() => _trackingOrder(item)}>
              <Text style={styles.itemActionText}>Track Order item</Text>
            </TouchableOpacity>
          ) : null}
          {item?.status_id == 3 ? (
            <TouchableOpacity
              style={styles.itemActionBtn}
              onPress={() => _writeReview(item)}>
              <Text style={styles.itemActionText}>Write a product review</Text>
            </TouchableOpacity>
          ) : null}
          {item?.status_id == 4 || item?.status_id == 5 ? (
            <TouchableOpacity
              style={styles.itemActionBtn}
              onPress={() => _cancelProduct(item)}>
              <Text style={styles.itemActionText}>Refund details</Text>
            </TouchableOpacity>
          ) : null}
          {/* {item?.status_id == 6 ? (
            <TouchableOpacity
              style={styles.itemActionBtn}
              onPress={() => _disputeProduct(item)}>
              <Text style={styles.itemActionText}>Dispute details</Text>
            </TouchableOpacity>
          ) : null} */}
          {item?.status_id == 9 ? (
            <TouchableOpacity
              style={styles.itemActionBtn}
              onPress={() => _cancelProduct(item)}>
              <Text style={styles.itemActionText}>Return/Exchange</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View>
      {data?.map(renderItem)}
      <TrackingOrderModal />
      <OrderFeedbackModal
        isVisible={feedbackModalVisible}
        onClose={() => showFeedbackModalVisible(false)}
        item={orderActionProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
  },
  itemContainer: {
    flexDirection: 'row',
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(12),
    color: colors.black,
    flex: 1,
    marginBottom: moderateScale(3),
  },
  statusText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(11),
    color: colors.primary,
    marginBottom: moderateScale(3),
  },
  productItemPrice: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.black,
    marginTop: moderateScale(5),
  },
  itemImg: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: 10,
    marginRight: 10,
  },
  itemActionContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // flexWrap: 'wrap',
    padding: moderateScale(10),
  },
  itemActionBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(5),
    marginLeft: moderateScale(10),
  },
  itemActionText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.white,
  },
});

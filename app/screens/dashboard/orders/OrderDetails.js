/* eslint-disable curly */
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {moderateScale, ms} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOrderDetails,
  orderCompleted,
  updateOrderState,
} from '../../../actions';
import Header from '../../../components/Header';
import OrderFeedbackModal from '../../../components/Modals/OrderFeedbackModal';
import {
  CancelOrderModal,
  ExtendProcessingModal,
} from '../../../components/orderModals';
import {RequestForReturnReplaceModal} from '../../../components/orderModals/RequestForReturnReplace';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import {formatPhoneNumber} from '../../../utils/arrayOperations';
import OrderProducts from './OrderProducts';

export default function OrderDetails({navigation, route}) {
  const dispatch = useDispatch();
  const {orderDetails} = useSelector(state => state.order);
  const data = orderDetails;

  const [menuVisible, setMenuVisible] = useState(false);
  const [feedbackModalVisible, showFeedbackModalVisible] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    dispatch(getOrderDetails());
  };

  const _closeMenu = () => {
    setMenuVisible(false);
  };

  const _menuAction = async action => {
    _closeMenu();
    await new Promise(resolve => setTimeout(resolve, 350));
    switch (action) {
      case 'cancel':
        dispatch(updateOrderState('orderActionProduct', orderDetails));
        dispatch(updateOrderState('showCancelOrderModal', true));
        break;
      case 'extendTime':
        dispatch(updateOrderState('orderActionProduct', orderDetails));
        dispatch(updateOrderState('showExtendProcessingModal', true));
        break;
      case 'returnReplace':
        dispatch(updateOrderState('orderActionProduct', orderDetails));
        dispatch(updateOrderState('showRequestForReturnReplaceModal', true));
        break;
      case 'confirmOrder':
        Alert.alert(
          'Item received',
          "Please confirm an order received, only after you've received the product. Remember after you confirm you received the order, you will be able to request for refund or return.",
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: async () => {
                let res = await orderCompleted({
                  user_order_products_id:
                    orderDetails?.user_order_product[0]?.user_order_products_id,
                });
                if (res) initData();
              },
            },
          ],
        );
        break;

      case 'writeReview':
        showFeedbackModalVisible(true);
        break;

      case 'disputeDetail':
        navigation.navigate('disputeDetails');
        break;

      default:
        break;
    }
  };

  const renderOrderDetails = () => {
    const status = orderDetails?.user_order_product[0]?.status;
    let statusText = '';
    if (status === 0) statusText = 'Pending';
    else if (status === 1) statusText = 'Processing';
    else if (status === 2) statusText = 'Shipped';
    else if (status === 3 || status === 6 || status === 7)
      statusText = 'Delivered';
    else if (status === 4) statusText = 'Dispute';
    else if (status === 5) statusText = 'Cancelled';
    else if (status === 8 || status === 9) statusText = 'Refunded';

    return (
      <>
        <View style={styles.card}>
          <View style={styles.rowItem}>
            <Text style={styles.infoTitleText}>Order Summary</Text>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
          <View style={styles.rowPrice}>
            <Text style={styles.trackingItemText}>Order ID :</Text>
            <Text style={styles.trackingItemValue}>#{data?.order_number}</Text>
          </View>
          <View style={styles.rowPrice}>
            <Text style={styles.trackingItemText}>Date :</Text>
            <Text style={styles.trackingItemValue}>
              {moment(data?.order_date_time).format('DD-MMM-YYYY')}
            </Text>
          </View>
          <View style={styles.rowPrice}>
            <Text style={styles.trackingItemText}>Payment Method :</Text>
            <Text style={styles.trackingItemValue}>
              {data?.payment_type === 1 ? 'COD' : 'Prepaid'}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderSummary = () => {
    const address = data?.order_shipping_address || {};
    const address2 = data?.shipping_detail || {};
    // console.log(address);
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.infoTitleText}>Delivery Address</Text>
          <Text style={styles.highlightText}>{address?.name}</Text>
          <Text style={styles.trackingItemText}>
            {address?.address1} {address?.address2}
          </Text>
          <Text style={styles.trackingItemText}>
            {address?.city}, {address?.state}-{address.pin_code}
          </Text>
          <Text style={styles.trackingItemText}>
            {formatPhoneNumber(address.phone_number)}
          </Text>

          {orderDetails?.user_order_product[0]?.status === 2 ? (
            <>
              <View style={{height: 15}} />
              {address2.shipping_carrier ? (
                <View style={styles.rowPrice}>
                  <Text style={styles.trackingItemText}>
                    Shipping carrier :
                  </Text>
                  <Text style={styles.trackingItemValue}>
                    {address2.shipping_carrier}
                  </Text>
                </View>
              ) : null}

              {address2.awb_number ? (
                <View style={styles.rowPrice}>
                  <Text style={styles.trackingItemText}>AWB Number :</Text>
                  <Text style={styles.trackingItemValue}>
                    {address2.awb_number}
                  </Text>
                </View>
              ) : null}

              {address2.tracking_link ? (
                <View style={styles.rowPrice}>
                  <Text style={styles.trackingItemText}>Tracking Link :</Text>
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => Linking.openURL(address2.tracking_link)}>
                    <Text
                      style={[
                        styles.trackingItemValue,
                        {color: colors.blue, textDecorationLine: 'underline'},
                      ]}>
                      {address2.tracking_link}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : null}
          {orderDetails?.user_order_product[0]?.status > 2 ? (
            <>
              <Text style={styles.shippingMsg}>
                Your item has been delivered via {address2.shipping_carrier} -{' '}
                {address2.awb_number}
              </Text>
            </>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.infoTitleText}>Payment Summary</Text>
          <View style={styles.rowPrice}>
            <Text style={styles.trackingItemText}>Sub total :</Text>
            <Text style={styles.trackingItemText}>{data?.sub_total}</Text>
          </View>
          {data?.discount_amount ? (
            <View style={styles.rowPrice}>
              <Text style={styles.trackingItemText}>Discount :</Text>
              <Text style={styles.trackingItemText}>
                {data?.discount_amount}
              </Text>
            </View>
          ) : null}

          <View style={styles.rowPrice}>
            <Text style={styles.trackingItemText}>Shipping :</Text>
            <Text style={styles.trackingItemText}>
              {data?.shipping_charges}
            </Text>
          </View>
          <View style={styles.rowPrice}>
            <Text style={styles.trackingItemText}>Tax :</Text>
            <Text style={styles.trackingItemText}>
              {!data?.tax_charges ? 'Free' : data?.tax_charges}
            </Text>
          </View>

          <View style={styles.rowPrice}>
            <Text style={styles.highlightText}>Grand Total :</Text>
            <Text style={styles.highlightText}>
              Rs. {data?.total_price?.toFixed(2)}
            </Text>
          </View>
        </View>
        {/* <View style={styles.card}>
          <Text style={styles.infoTitleText}>Download</Text>
          <View style={styles.rowItem}>
            <Text style={styles.highlightText}>Invoice</Text>
            <TouchableOpacity>
              <Icon name="cloud-download-outline" size={moderateScale(20)} />
            </TouchableOpacity>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.highlightText}>Order details</Text>
            <TouchableOpacity>
              <Icon name="cloud-download-outline" size={moderateScale(20)} />
            </TouchableOpacity>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.highlightText}>Print order details</Text>
            <TouchableOpacity>
              <Icon name="print-outline" size={moderateScale(20)} />
            </TouchableOpacity>
          </View>
        </View> */}
      </>
    );
  };

  const renderProductList = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.infoTitleText}>Order products</Text>
        <OrderProducts data={data?.user_order_product} />
      </View>
    );
  };

  const product = data?.user_order_product[0];

  return (
    <View style={styles.root}>
      <Header
        title={'Order Details'}
        isBack
        center
        rightActions={
          <Menu
            visible={menuVisible}
            anchor={
              <TouchableOpacity
                style={styles.menuIc}
                onPress={() => setMenuVisible(true)}>
                <Icon
                  name="more-vert"
                  size={moderateScale(24)}
                  color={colors.white}
                />
              </TouchableOpacity>
            }
            onRequestClose={_closeMenu}>
            {product?.exchange_count === 0 &&
            (product?.status == 0 || product?.status == 1) ? (
              <>
                <MenuItem onPress={() => _menuAction('cancel')}>
                  Cancel Order
                </MenuItem>
                <MenuDivider />
              </>
            ) : null}
            {product?.status == 1 ? (
              <>
                <MenuItem onPress={() => _menuAction('extendTime')}>
                  Extend Processing Time
                </MenuItem>
                <MenuDivider />
              </>
            ) : null}
            {product?.status == 2 ? (
              <>
                <MenuItem onPress={() => _menuAction('confirmOrder')}>
                  Confirm Order
                </MenuItem>
                <MenuDivider />
              </>
            ) : null}
            {product?.status == 3 &&
            !product?.dispute_request_id &&
            moment().isBefore(product?.product_dispute_last_date_time) ? (
              <>
                <MenuItem onPress={() => _menuAction('returnReplace')}>
                  Request for Return/Replace
                </MenuItem>
                <MenuDivider />
              </>
            ) : null}
            {product?.status >= 3 && product?.status != 5 ? (
              <>
                <MenuItem onPress={() => _menuAction('writeReview')}>
                  Write Review
                </MenuItem>
                <MenuDivider />
              </>
            ) : null}
            {product?.status >= 3 && product?.dispute_request_id ? (
              <>
                <MenuItem onPress={() => _menuAction('disputeDetail')}>
                  Dispute Detail
                </MenuItem>
                <MenuDivider />
              </>
            ) : null}
          </Menu>
        }
      />
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}>
        {renderOrderDetails()}
        {renderSummary()}
        {renderProductList()}
        {/* {renderTrackingInfo()} */}
      </ScrollView>
      <CancelOrderModal />
      <RequestForReturnReplaceModal />
      <ExtendProcessingModal />
      <OrderFeedbackModal
        isVisible={feedbackModalVisible}
        onClose={() => showFeedbackModalVisible(false)}
        item={orderDetails}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'rgba(197, 206, 224, 0.1)',
    padding: moderateScale(20),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: 'rgba(197, 206, 224, 0.5)',
  },
  infoTitleText: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(14),
    color: colors.blue,
    marginBottom: moderateScale(10),
  },
  trackingItemText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: '#87879D',
    marginVertical: moderateScale(4),
    flex: 1,
  },
  trackingItemValue: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: '#87879D',
    marginVertical: moderateScale(4),
    flex: 1,
    textAlign: 'right',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: moderateScale(5),
  },
  rowPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highlightText: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(14),
    color: '#0089B4',
    marginTop: moderateScale(10),
  },
  statusText: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(14),
    color: colors.primary,
  },
  menuIc: {
    paddingHorizontal: ms(10),
  },
  shippingMsg: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(14),
    color: colors.green,
    marginTop: moderateScale(15),
  },
});

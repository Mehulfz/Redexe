/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate} from '../../navigation/RootNavigation';

export const Payment = ({data, updateData, paymentType, setPaymentType}) => {
  const [couponCode, setCouponCode] = useState(data?.coupon || '');
  const cart = data?.cart;

  const _applyCoupon = async (code = couponCode) => {
    if (code) {
      updateData('update', {coupon_code: code});
    }
  };

  const _removeCoupon = () => {
    updateData('update', {coupon_code: ''});
    setCouponCode('');
  };

  const _viewAll = () => {
    navigate('applyCoupons', {data: data?.coupon_list, apply: _applyCoupon});
  };

  const renderPaymentType = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Type</Text>

        {cart?.payment_method?.map((item, i) => {
          return (
            <View key={String(i)} style={{opacity: item.isDisable ? 0.5 : 1}}>
              <TouchableOpacity
                onPress={() => setPaymentType(item)}
                style={styles.radioRow}
                activeOpacity={0.7}
                disabled={item.isDisable}>
                <View style={styles.radioCircle}>
                  {paymentType === item ? (
                    <View style={styles.radioFillCircle} />
                  ) : null}
                </View>
                <Text style={styles.radioText}>
                  {item?.Text || item?.RazorPay}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}>
      <View style={styles.couponContain}>
        {cart?.coupon?.code ? (
          <TextInput
            style={styles.couponInput}
            value={String(cart?.coupon?.code)}
            placeholder="Enter Coupon"
            placeholderTextColor={colors.darkGray}
            editable={false}
          />
        ) : (
          <TextInput
            style={styles.couponInput}
            placeholder="Enter Coupon"
            placeholderTextColor={colors.darkGray}
            value={couponCode}
            onChangeText={setCouponCode}
            editable
          />
        )}
      </View>
      {cart?.coupon?.code && cart?.saving?.discount_saved_amount ? (
        <Text style={styles.couponApplyText}>
          ₹{cart?.saving?.discount_saved_amount} savings with this coupon.
        </Text>
      ) : null}
      {cart?.coupon?.code && cart?.coupon?.invalid ? (
        <Text style={[styles.couponApplyText, {color: colors.red}]}>
          {cart?.coupon?.invalid}
        </Text>
      ) : null}

      <View style={{height: ms(15)}} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={_viewAll}>
          <Text style={[styles.couponText, {textDecorationLine: 'underline'}]}>
            View all coupon
          </Text>
        </TouchableOpacity>
        {cart?.coupon?.code ? (
          <TouchableOpacity onPress={_removeCoupon}>
            <Text style={styles.removeCoupon}>Remove Coupon</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => _applyCoupon(couponCode)}
            disabled={!couponCode ? true : false}>
            <Text style={styles.couponText}>Apply Coupon</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{height: ms(30)}} />
      <View style={styles.rowPrice}>
        <Text style={styles.trackingItemText}>Sub total :</Text>
        <Text style={styles.trackingItemText}>₹{cart?.total_sale_price}</Text>
      </View>
      {cart?.saving?.discount_saved_amount ? (
        <View style={styles.rowPrice}>
          <Text style={styles.trackingItemText}>Discount applied :</Text>
          <Text style={styles.trackingItemText}>
            - ₹{cart?.saving?.discount_saved_amount}
          </Text>
        </View>
      ) : null}
      <View style={styles.rowPrice}>
        <Text style={styles.trackingItemText}>Delivery Charges :</Text>
        <Text style={styles.trackingItemText}>
          {cart?.total_shipping_amount
            ? '₹' + cart?.total_shipping_amount
            : 'Free'}
        </Text>
      </View>

      {/* <View style={styles.rowPrice}>
        <Text style={styles.trackingItemText}>Tax :</Text>
        <Text style={styles.trackingItemText}>
          ₹{cart?.total_tax_amount?.toFixed(2)}
        </Text>
      </View> */}
      <View style={styles.divider} />
      <View style={styles.rowPrice}>
        <Text style={styles.highlightText}>
          Total <Text style={{fontSize: ms(12)}}>(Inclusive of all taxes)</Text>
          :
        </Text>
        <Text style={[styles.highlightText, {color: colors.primary}]}>
          ₹{cart?.gross_total?.toFixed(2)}
        </Text>
      </View>
      {renderPaymentType()}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    padding: ms(20),
  },
  couponContain: {
    borderWidth: ms(1),
    borderColor: colors.lightGray,
    borderRadius: ms(40),
    height: ms(40),
    paddingHorizontal: ms(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    paddingVertical: 0,
    fontFamily: env.fontRegular,
    fontSize: ms(13),
    color: colors.black,
    flex: 1,
    marginRight: ms(15),
  },
  couponText: {
    fontFamily: env.fontMedium,
    fontSize: ms(14),
    color: colors.primary,
  },
  removeCoupon: {
    color: '#747B81',
    textDecorationLine: 'underline',
    textAlign: 'right',
    fontFamily: env.fontMedium,
    fontSize: ms(14),
  },
  rowPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  trackingItemText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(16),
    color: '#87879D',
    marginVertical: moderateScale(4),
  },
  highlightText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(18),
    marginTop: moderateScale(10),
  },
  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginTop: ms(15),
    marginBottom: ms(5),
  },
  card: {
    marginBottom: ms(15),
    marginTop: ms(35),
  },
  cardTitle: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(14),
    color: colors.black,
    marginBottom: moderateScale(15),
  },
  radioText: {
    color: colors.black,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
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
  couponApplyText: {
    color: colors.green,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    marginHorizontal: moderateScale(5),
    marginTop: moderateScale(10),
  },
});

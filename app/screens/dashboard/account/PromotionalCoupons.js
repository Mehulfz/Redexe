import _ from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getPromotionCoupons} from '../../../actions/meta';
import assets from '../../../assets';
import EmptyList from '../../../components/EmptyList';
import Header from '../../../components/Header';
import colors from '../../../constants/colors';
import env from '../../../constants/env';

export default function PromotionalCoupons() {
  const [data, setData] = useState([]);
  const [loader, showLoader] = useState(true);
  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(1);
  const preventLoader = useRef(false);
  const isEndReached = useRef(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async (params = {}) => {
    params.page = pageNumber.current;
    params.limit = 50;
    let res = await getPromotionCoupons(params);
    showLoader(false);
    showLoadMore(false);
    preventLoader.current = false;
    if (res?.length) {
      if (!pageNumber.current == 1) return setData(res);
      let resultData = [...data, ...res];
      resultData = _.uniqBy(resultData, 'coupon_and_discount_id');
      setData(resultData);
    } else {
      isEndReached.current = true;
    }
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndReached.current) return;
    pageNumber.current += 1;
    showLoadMore(true);
    initData();
  };

  const renderItem = (item, index) => {
    const coupon = item.coupon_and_discount_data;
    return (
      <ImageBackground
        source={item === 'used' ? assets.blue_bg : assets.coupon_bg}
        style={[styles.item, {tintColor: 'rgba(0, 137, 180, 0.86)'}]}
        resizeMode="stretch"
        key={String(index)}>
        <Text style={styles.companyText}>{coupon.promotion_name}</Text>
        <Text style={styles.subText}>
          Validity :{' '}
          {moment(coupon.promotions_start_date_time).format(
            'DD-MMM-YYYY h:mm a',
          )}{' '}
          to{' '}
          {moment(coupon.promotions_end_date_time).format('DD-MMM-YYYY h:mm a')}
        </Text>
        <Text style={styles.subText}>
          Limited per buyer : {coupon.limit_per_buyer}
        </Text>
        <Text style={[styles.companyText, {fontSize: 14}]}>
          Coupon Applicable :{' '}
          {coupon.discount_condition == 0
            ? 'All Products in Store'
            : `Buy rs. ${coupon.discount_condition} & above`}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Text style={styles.couponCode}>
            CODE : {coupon.coupon_promotion_code}
          </Text>
          <TouchableOpacity style={styles.discountLabel}>
            <Text style={styles.subText}>{coupon.discount_value}% Off</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };

  const renderItemExpired = (item, index) => {
    const coupon = item.coupon_and_discount_data;
    return (
      <ImageBackground
        source={assets.skyblue_bg}
        style={[styles.item, {tintColor: 'rgba(0, 137, 180, 0.86)'}]}
        resizeMode="stretch"
        key={String(index)}>
        <Text style={[styles.companyText, {color: colors.black}]}>
          {coupon.promotion_name}
        </Text>
        <Text style={[styles.subText, {color: colors.black}]}>
          Validity :{' '}
          {moment(coupon.promotions_start_date_time).format(
            'DD-MMM-YYYY h:mm a',
          )}{' '}
          to{' '}
          {moment(coupon.promotions_end_date_time).format('DD-MMM-YYYY h:mm a')}
        </Text>
        <Text style={[styles.subText, {color: colors.black}]}>
          Limited per buyer : {coupon.limit_per_buyer}
        </Text>
        <Text style={[styles.companyText, {fontSize: 14, color: '#CB0808'}]}>
          Coupon Applicable :{' '}
          {coupon.discount_condition == 0
            ? 'All Products in Store'
            : `Buy rs. ${coupon.discount_condition} & above`}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Text style={[styles.couponCode, {color: '#0089B4'}]}>
            CODE : {coupon.coupon_promotion_code}
          </Text>
          <TouchableOpacity style={styles.discountLabel}>
            <Text style={styles.subText}>{coupon.discount_value}% Off</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };

  const activeList = [],
    expiredList = [],
    usedList = [];

  data.map((item) => {
    if (item.isUsed == 1) usedList.push(item);
    else if (moment().isAfter(new Date(item.expired_at)))
      expiredList.push(item);
    else activeList.push(item);
  });

  return (
    <View style={styles.root}>
      <Header title="Promotion and coupons" isBack />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: 15}}
        showsVerticalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        legacyImplementation
        onScrollEndDrag={_handleLoadMore}>
        {!data?.length ? (
          <EmptyList isLoading={loader} message={'No coupon found!'} />
        ) : null}
        {activeList && activeList?.length ? (
          <>
            <View style={styles.row}>
              <View style={styles.titleDivider} />
              <Text style={styles.title}>Active coupon</Text>
            </View>
            <View style={{marginTop: 20}}>{activeList.map(renderItem)}</View>
            <View style={{height: 20}} />
          </>
        ) : null}

        {expiredList && expiredList?.length ? (
          <>
            <View style={styles.row}>
              <View
                style={[styles.titleDivider, {backgroundColor: '#F60101'}]}
              />
              <Text style={[styles.title, {color: '#F60101'}]}>
                Expired coupon
              </Text>
            </View>
            <View style={{marginTop: 20}}>
              {expiredList.map(renderItemExpired)}
            </View>
            <View style={{height: 20}} />
          </>
        ) : null}
        {usedList && usedList?.length ? (
          <>
            <View style={styles.row}>
              <View
                style={[styles.titleDivider, {backgroundColor: '#F6780A'}]}
              />
              <Text style={[styles.title, {color: '#F6780A'}]}>
                Used Coupon
              </Text>
            </View>
            <View style={{marginTop: 20}}>{usedList.map(renderItem)}</View>
          </>
        ) : null}
      </ScrollView>
      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRightText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: env.fontRegular,
    marginHorizontal: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignSelf: 'flex-end',
    borderRadius: 8,
  },
  filterIcon: {
    resizeMode: 'contain',
    height: 14,
    width: 14,
  },
  filterTitle: {
    fontFamily: env.fontMedium,
    fontSize: 15,
    color: colors.black,
    marginRight: 5,
  },
  titleDivider: {
    width: 3,
    backgroundColor: '#00973C',
    height: '100%',
  },
  title: {
    fontFamily: env.fontMedium,
    fontSize: 18,
    color: '#00973C',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyText: {
    fontFamily: env.fontMedium,
    fontSize: 15,
    color: colors.white,
    marginBottom: 5,
  },
  subText: {
    fontFamily: env.fontMedium,
    fontSize: 12,
    color: colors.white,
    marginBottom: 3,
  },
  couponCode: {
    fontFamily: env.fontMedium,
    fontSize: 16,
    color: colors.white,
  },
  discountLabel: {
    backgroundColor: '#EFAF00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  item: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 25,
    marginBottom: 10,
  },
});

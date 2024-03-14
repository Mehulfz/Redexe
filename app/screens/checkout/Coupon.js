import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ms} from 'react-native-size-matters';
// import {getCheckoutCoupons} from '../../actions';
import EmptyList from '../../components/EmptyList';
import Header from '../../components/Header';
import colors from '../../constants/colors';
import env from '../../constants/env';
import moment from 'moment';

const ApplyCoupon = ({navigation, route}) => {
  const data = route.params?.data || [];
  // const [data, setData] = React.useState([]);
  // const [IsLoading, setIsLoading] = React.useState(true);

  // React.useEffect(() => {
  //   initData();
  // }, []);

  // const initData = async () => {
  //   const res = await getCheckoutCoupons();
  //   setData(res || []);
  //   setIsLoading(false);
  // };

  const _apply = item => {
    if (route.params?.apply) {
      route.params?.apply(item?.coupon_promotion_code);
    }
    navigation.goBack();
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <View style={styles.codeContain}>
          <Text style={styles.codeText}>Code</Text>
          <Text style={styles.codeValueText}>
            {item?.coupon_promotion_code}
          </Text>
          <View style={styles.discountCircle}>
            <Text style={styles.discountText} adjustsFontSizeToFit>
              {item?.discount_value}%{'\n'}Off
            </Text>
          </View>
        </View>
        <View style={styles.infoContain}>
          <Text style={styles.validity}>
            Validity :{' '}
            {moment(item?.promotions_start_date_time).format('Do MMM')} to{' '}
            {moment(item?.promotions_end_date_time).format('Do MMM, YYYY')}
          </Text>
          <View style={styles.row}>
            <Text style={styles.applicable}>
              Coupon Applicable : {item?.promotion_name}
            </Text>
            {route.params?.apply ? (
              <TouchableOpacity style={styles.btn} onPress={() => _apply(item)}>
                <Text style={styles.btnText}>Apply</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <EmptyList
        containStyle={{backgroundColor: colors.white}}
        message={'No coupons found!'}
        // isLoading={IsLoading}
      />
    );
  };

  return (
    <View style={styles.root}>
      <Header isBack title="Coupons" center />
      <FlatList
        data={data}
        keyExtractor={(x, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};
export default ApplyCoupon;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F3F4',
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingVertical: ms(15),
  },
  item: {
    backgroundColor: colors.white,
    padding: ms(15),
    marginHorizontal: ms(15),
    marginBottom: ms(20),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(5),
  },
  codeContain: {
    width: ms(100),
    alignItems: 'center',
    padding: ms(5),
  },
  codeText: {
    fontFamily: env.fontMedium,
    fontSize: ms(14),
    color: '#747B81',
  },
  codeValueText: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    color: colors.black,
  },
  infoContain: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: colors.lightGray,
    paddingLeft: ms(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  btn: {
    backgroundColor: '#F15A2B',
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(3),
  },
  btnText: {
    fontFamily: env.fontRegular,
    fontSize: ms(12),
    color: colors.white,
  },
  applicable: {
    fontFamily: env.fontRegular,
    fontSize: ms(12),
    color: '#747B81',
    flex: 1,
    marginLeft: ms(5),
  },
  validity: {
    fontFamily: env.fontMedium,
    fontSize: ms(12),
    color: colors.black,
    flex: 1,
    marginBottom: ms(5),
  },
  discountCircle: {
    backgroundColor: '#EFAF00',
    borderRadius: ms(42),
    height: ms(42),
    width: ms(42),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: ms(-15),
    bottom: ms(-30),
  },
  discountText: {
    fontFamily: env.fontMedium,
    fontSize: ms(11),
    color: colors.white,
    textAlign: 'center',
  },
});

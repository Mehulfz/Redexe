import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {getProductFeedback} from '../../actions';
import Rating from '../../components/Rating';
import colors from '../../constants/colors';
import env from '../../constants/env';

export default function RenderFeedback() {
  const {productDetails} = useSelector(({product}) => product);

  const [data, setData] = useState([]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let res = await getProductFeedback({
      product_id: productDetails?.product_id,
    });
    if (res) {
      setData(res);
    }
  };

  const renderItem = (item, index) => {
    return (
      <View key={String(index)}>
        <View style={styles.rowBetween}>
          <Rating value={item?.feedback_rating} size={18} />
          <Text style={styles.feedbackTime}>
            {moment(item.created_at).format('Do, MMM YYYY')}
          </Text>
        </View>
        <View style={{height: 10}} />
        <Text style={styles.productDetailText}>{item?.feedback_comment}</Text>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={{padding: 15}}>
      <Text style={styles.feedbackText}>Feedback ({data?.length})</Text>
      <View style={{height: 20}} />
      {data?.map(renderItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackText: {
    fontFamily: env.fontMedium,
    color: colors.black,
    fontSize: 15,
  },
  rowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  feedbackTime: {
    fontFamily: env.fontRegular,
    color: colors.black,
    fontSize: moderateScale(12),
    opacity: 0.5,
  },
  divider: {
    backgroundColor: 'rgba(197, 206, 224, 0.25)',
    height: 1,
    marginVertical: moderateScale(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailText: {
    fontFamily: env.fontRegular,
    color: '#8F9BB3',
    fontSize: moderateScale(14),
  },
});

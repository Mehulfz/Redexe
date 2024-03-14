import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {updateProductState} from '../../actions';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {numberWithCommas} from '../../utils/arrayOperations';
import {FastImage} from '../FastImage';

const {width} = Dimensions.get('window');

export default function ProductItem({data}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(updateProductState('productDetails', data));
    navigation.navigate('productDetails');
  };

  return (
    <TouchableOpacity
      style={{padding: ms(5), justifyContent: 'center', flex: 1}}
      activeOpacity={1}
      onPress={handlePress}>
      <View
        style={{
          borderWidth: ms(1),
          borderColor: colors.SilverChalice,
          borderRadius: ms(5),
          backgroundColor: colors.white,
        }}>
        <View style={styles.discountBox}>
          <Text style={styles.discountText}>-{data?.discount_percentage}%</Text>
        </View>
        <FastImage
          contentStyle={styles.itemImage}
          source={{uri: data?.display_image}}
        />

        <View style={{marginHorizontal: ms(10), marginVertical: ms(10)}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {data?.product_name}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.priceText}>
            ₹{numberWithCommas(data?.display_min_price?.toFixed(2))}{' '}
            {data?.display_min_mrp ? (
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: colors.black,
                }}>
                ₹{numberWithCommas(data?.display_min_mrp?.toFixed(2))}
              </Text>
            ) : null}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemImage: {
    height: width / 2 - 40,
    width: width / 2 - 40,
    borderRadius: ms(5),
    marginTop: ms(8),
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: ms(1),
    borderColor: colors.SilverChalice,
    overflow: 'hidden',
  },
  itemTitle: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    color: colors.black,
    flex: 1,
    marginBottom: ms(5),
  },
  priceText: {
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: ms(12),
  },
  discountText: {
    color: colors.white,
    fontFamily: env.fontMedium,
    fontSize: ms(12),
  },
  discountBox: {
    borderRadius: 5,
    backgroundColor: colors.red,
    zIndex: 1,
    position: 'absolute',
    right: ms(15),
    top: ms(13),
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(5),
  },
});

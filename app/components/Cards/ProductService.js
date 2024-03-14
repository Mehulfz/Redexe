import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';

export default function ProductService({
  replacement = 'No',
  processingTime = '0',
  shippingDays = '0',
  warrantyPeriod,
  location,
}) {
  const flatListRef = useRef(null);

  const data = [
    {
      icon: assets.replacement,
      title: 'Replacement',
      desc: replacement,
      color: colors.Brown,
    },
    {
      icon: assets.clock,
      title: 'Processing',
      desc: processingTime + ' days',
      color: colors.Lochmara,
    },
    {
      icon: assets.package_icon,
      title: 'Shipping',
      desc: shippingDays + ' days',
      color: colors.Galliano,
    },
    {
      icon: assets.loation_icon,
      title: 'Seller',
      desc: location || '',
    },
    {
      icon: assets.doc,
      title: 'Warranty',
      desc: warrantyPeriod,
      color: colors.orange,
    },
  ];

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Image
          source={item.icon}
          style={[styles.icon, {tintColor: item.color}]}
        />

        <View style={{flex: 1, marginTop: 5}}>
          <Text
            style={[styles.itemTitle, {color: item.color}]}
            numberOfLines={2}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.priceText}>
            {item.desc}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* <View style={{alignItems: 'flex-end', padding: 15}}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() =>
              flatListRef.current.scrollToOffset({animated: true, offset: 0})
            }>
            <Image
              source={assets.arrow_right_ic}
              style={styles.arrowLeftIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => flatListRef.current.scrollToEnd()}>
            <Image
              source={assets.arrow_right_ic}
              style={styles.arrowRightIcon}
            />
          </TouchableOpacity>
        </View>
      </View> */}

      <FlatList
        data={data}
        ref={flatListRef}
        keyExtractor={(it, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={{paddingLeft: 5}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    margin: 10,
  },
  itemTitle: {
    fontFamily: env.fontRegular,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
  },
  priceText: {
    color: '#8F9BB3',
    fontFamily: env.fontRegular,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 5,
  },
  icon: {
    height: ms(20),
    width: ms(20),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  arrowLeftIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: colors.primary,
    transform: [{rotate: '180deg'}],
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

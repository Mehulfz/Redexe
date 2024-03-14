import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import colors from '../../constants/colors';
import env from '../../constants/env';

const {width} = Dimensions.get('screen');

export default function BestSelles() {
  const renderItem = ({item}) => {
    let itemSize = width * 0.4;
    return (
      <View style={styles.item}>
        <Image
          source={{
            uri:
              'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
          }}
          style={{
            height: itemSize,
            width: itemSize,
            borderRadius: 10,
          }}
        />

        <View style={{flex: 1, marginTop: 5}}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            Lorem ipsum Lorem ipsum
          </Text>
          <Text numberOfLines={1} style={styles.priceText}>
            Rs 800.00{' '}
            <Text
              style={{textDecorationLine: 'line-through', color: colors.black}}>
              Rs 1000.00
            </Text>
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            backgroundColor: colors.red,
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
            right: -10,
            top: -10
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.white,
              fontSize: 10,
              fontFamily: env.fontSemibold,
            }}>
            20% off
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={['Apparel and Accessories', 'Health', 'Beauty']}
      keyExtractor={(it, i) => String(i)}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      contentContainerStyle={{paddingLeft: 5}}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    width: width * 0.4,
    margin: 5,
    marginTop: 10,
    marginRight: 10
  },
  itemTitle: {
    fontFamily: env.fontRegular,
    fontSize: 15,
    color: '#8F9BB3',
  },
  priceText: {
    color: '#0089B4',
    fontFamily: env.fontRegular,
    fontSize: 13,
  },
});

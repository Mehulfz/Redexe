import React, {useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { ms } from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';

const width = Dimensions.get("screen").width

export default function ProductSpecification() {
  const flatListRef = useRef(null);
  const {productDetails} = useSelector(({product}) => product);
  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.icon} />

        <View style={{flex: 1, marginTop: 5}}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.PropertyName}
          </Text>
          <Text numberOfLines={1} style={styles.priceText}>
            {item.PropertyValue}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Product Specification</Text>
        {/* <View style={styles.row}>
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
        </View> */}
      </View>

      <FlatList
        data={productDetails?.product_specification}
        ref={flatListRef}
        keyExtractor={(it, i) => String(i)}
        numColumns={3}
        scrollEnabled={false}
        // horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={{paddingLeft: 5}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.black,
  },
  item: {
    width: width/3 - ms(10),
    margin: ms(5)
  },
  itemTitle: {
    fontFamily: env.fontRegular,
    fontSize: 13,
    color: colors.black,
    textAlign: 'center',
    marginTop: 5,
  },
  priceText: {
    color: '#8F9BB3',
    fontFamily: env.fontRegular,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 5,
  },
  icon: {
    height: 40,
    width: 40,
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

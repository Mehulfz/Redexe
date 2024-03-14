import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {ms} from 'react-native-size-matters';
import EmptyList from '../../components/EmptyList';
import colors from '../../constants/colors';
import env from '../../constants/env';

export const CheckoutProducts = ({products}) => {
  const renderEmpty = () => {
    return (
      <EmptyList
        containStyle={{backgroundColor: colors.white}}
        message={'No items in your cart yet.'}
      />
    );
  };

  const renderItem = ({item}) => {
    const product = item;
    return (
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <Image style={styles.itemImg} source={{uri: item?.product_image}} />
          <View style={{flex: 1}}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {product?.product_name}
            </Text>
            {item?.size || item?.color ? (
              <>
                <Text style={styles.statusText}>
                  {item?.size ? `Size : ${item?.size}` : null}
                  {item?.color && item?.size ? '  |  ' : ''}
                  {item?.color ? `Color : ${item?.color}` : null}
                </Text>
              </>
            ) : null}
            <Text style={styles.productItemPrice}>
              ₹{Number(item?.sub_total)?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={products}
        keyExtractor={(x, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingVertical: ms(15),
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: ms(12),
    color: colors.black,
    flex: 1,
    marginBottom: ms(3),
  },
  statusText: {
    fontFamily: env.fontRegular,
    fontSize: ms(16),
    color: colors.black,
    lineHeight: ms(24),
  },
  productItemPrice: {
    fontFamily: env.fontRegular,
    fontSize: ms(16),
    lineHeight: ms(24),
    color: '#747B81',
  },
  itemImg: {
    height: ms(80),
    width: ms(80),
    marginRight: ms(10),
  },
  divider: {
    backgroundColor: '#ECECEC',
    height: 1,
    marginVertical: 8,
  },
  item: {
    backgroundColor: '#FFF',
    borderRadius: ms(10),
    marginHorizontal: ms(10),
    marginBottom: ms(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: ms(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

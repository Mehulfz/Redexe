/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {
  getCartProducts,
  productAddRemoveToWishlist,
  productRemoveFromCart,
  productUpdateCart,
} from '../../actions';
import assets from '../../assets';
import {Button} from '../../components/Buttons';
import EmptyList from '../../components/EmptyList';
import Header from '../../components/Header';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate} from '../../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MyCart({navigation}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);
  const {cartProducts} = useSelector(({product}) => product);

  const [selectionLoading, setSelectionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const selectedItem = cartProducts?.cart_items?.filter(
    (x) => x.status === 'true' || x.status === true,
  );

  useEffect(() => {
    if (currentUser) {
      dispatch(getCartProducts());
    }
  }, []);

  const _refreshing = async () => {
    setRefreshing(true);
    await dispatch(getCartProducts());
    setRefreshing(false);
  };

  const handleQty = (action, item) => {
    let quantity = Number(item.quantity);
    if (action == 'add') {
      quantity += 1;
    } else {
      if (quantity > 1) {
        quantity -= 1;
      }
    }
    dispatch(
      productUpdateCart({
        actionType: 'update-quantity',
        id: item.id,
        product_id: item.product_id,
        quantity,
      }),
    );
  };

  const _removeProduct = (item) => {
    Alert.alert('Delete!', 'Do you want to delete product from cart?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(productRemoveFromCart(item.id));
        },
      },
    ]);
  };

  const _wishlistAction = async (item) => {
    await dispatch(
      productAddRemoveToWishlist({
        status: item?.isWishlist ? 0 : 1,
        product_id: item.product_id,
      }),
    );
    dispatch(getCartProducts());
  };

  const _itemSelect = async (item, isSelect) => {
    setSelectionLoading(true);
    let request = {
      isSelect,
      actionType: 'update-selection-item',
    };
    if (isSelect === 'all') {
      const isChecked =
        selectedItem?.length === cartProducts?.cart_items?.length;
      request.ids = cartProducts?.cart_items?.map((x) => x.id);
      request.isSelect = !isChecked;
    } else {
      request.ids = [item.id];
    }
    await dispatch(productUpdateCart(request));
    setSelectionLoading(false);
  };

  const _checkout = () => {
    navigation.navigate('confirmOrder');
  };

  if (!currentUser) {
    return (
      <EmptyList
        containStyle={{backgroundColor: colors.white}}
        message={'Login to access your cart.'}
        bottom={
          <Text onPress={() => navigate('auth')} style={styles.hyperLink}>
            Login to your account
          </Text>
        }
      />
    );
  }

  const renderItem = ({item}) => {
    const isChecked = item?.status === 'true' || item?.status === true;
    const product = item;
    return (
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.itemImg}
            source={{uri: product?.display_image}}
          />
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {product?.product_name}
              </Text>
              <TouchableOpacity
                disabled={selectionLoading}
                onPress={() => _itemSelect(item, !isChecked)}
                style={styles.itemCheckbox}>
                <Icon
                  name={isChecked ? 'checkbox-outline' : 'square-outline'}
                  size={moderateScale(18)}
                  color={colors.blue}
                />
              </TouchableOpacity>
            </View>
            {item?.size || item?.color ? (
              <Text style={styles.statusText}>
                {item?.size ? `Size : ${item?.size}` : null}
                {item?.color && item?.size ? '  |  ' : ''}
                {item?.color ? `Color : ${item?.color}` : null}
              </Text>
            ) : null}

            <Text style={styles.productItemPrice}>
              Rs.{Number(item?.sub_total)?.toFixed(2)}
            </Text>

            <View style={styles.row}>
              <View style={styles.qtyContain}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  disabled={item.quantity == 1}
                  onPress={() => handleQty('remove', item)}>
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.productItemPrice, {marginHorizontal: 10}]}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => handleQty('add', item)}>
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => _wishlistAction(item)}>
                  <Image
                    source={
                      item?.isWishlist ? assets.heartFill : assets.heartUnfilled
                    }
                    style={styles.hartIcon}
                  />
                </TouchableOpacity>
                <View style={{width: moderateScale(15)}} />
                <TouchableOpacity onPress={() => _removeProduct(item)}>
                  <Icon
                    name="trash-outline"
                    size={moderateScale(18)}
                    color={colors.red}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!selectedItem?.length) {
      return null;
    }
    return (
      <View
        style={{marginHorizontal: ms(40), marginVertical: moderateScale(10)}}>
        <Button
          title={'Checkout' + ` (Rs.${cartProducts?.sub_total?.toFixed(2)})`}
          onPress={_checkout}
          containerStyle={{
            height: moderateScale(40),
          }}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <EmptyList
        containStyle={{backgroundColor: colors.white}}
        message={'No items in your cart yet.'}
      />
    );
  };

  return (
    <View style={styles.root}>
      <Header
        title="My Cart"
        rightActions={
          cartProducts?.cart_items?.length ? (
            <TouchableOpacity
              disabled={selectionLoading}
              onPress={() => _itemSelect(cartProducts?.cart_items, 'all')}
              style={{marginRight: moderateScale(15)}}>
              <Icon
                name={
                  selectedItem?.length === cartProducts?.cart_items?.length
                    ? 'checkbox-outline'
                    : 'square-outline'
                }
                size={moderateScale(20)}
                color={colors.white}
              />
            </TouchableOpacity>
          ) : null
        }
      />
      <FlatList
        data={cartProducts?.cart_items}
        keyExtractor={(x, i) => String(i)}
        renderItem={renderItem}
        // ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainerStyle}
        refreshing={refreshing}
        onRefresh={_refreshing}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.50)',
  },
  headerRightText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: env.fontRegular,
    marginHorizontal: 15,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(12),
    color: colors.black,
    flex: 1,
    marginBottom: moderateScale(3),
  },
  statusText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(11),
    color: colors.primary,
    marginBottom: moderateScale(3),
  },
  productItemPrice: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.black,
  },
  itemImg: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: 10,
    marginRight: 10,
  },
  divider: {
    backgroundColor: '#ECECEC',
    height: 1,
    marginVertical: 8,
  },
  item: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyButton: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C5CEE0',
    borderRadius: 30,
  },
  qtyButtonText: {
    fontFamily: env.fontBold,
    fontSize: 15,
    color: colors.black,
  },
  checkoutLabels: {
    fontFamily: env.fontMedium,
    fontSize: 16,
    color: '#87879D',
  },
  checkoutPrice: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: '#A1A1B4',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  continueText: {
    fontFamily: env.fontBold,
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  hyperLink: {
    textDecorationLine: 'underline',
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
  },
  hartIcon: {
    resizeMode: 'contain',
    width: moderateScale(18),
    height: moderateScale(18),
  },
  qtyContain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemCheckbox: {
    marginLeft: moderateScale(5),
  },
});

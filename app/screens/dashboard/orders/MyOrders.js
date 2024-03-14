/* eslint-disable curly */
import _ from 'lodash';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {
  getMyOrders,
  productAddToCart,
  rootLoader,
  updateOrderState,
} from '../../../actions';
import assets from '../../../assets';
import EmptyList from '../../../components/EmptyList';
import Header from '../../../components/Header';
import colors from '../../../constants/colors';
import env from '../../../constants/env';
import {groupByDate} from '../../../utils/arrayOperations';
import Icon from 'react-native-vector-icons/MaterialIcons';

function MyOrders({navigation, route}) {
  const dispatch = useDispatch();
  const {status, title} = route.params || {};
  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const [loader, showLoader] = useState(true);
  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(1);
  const preventLoader = useRef(false);
  const isEndReached = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async (params = {}) => {
    params.page = pageNumber.current;
    params.limit = 15;
    params.status = 0;
    if (status) params.status = status;
    let res = await getMyOrders(params);
    showLoader(false);
    showLoadMore(false);
    setRefreshing(false);
    preventLoader.current = false;
    if (res?.length) {
      if (pageNumber.current == 1) return setData(res);
      let resultData = [...data, ...res];
      resultData = _.uniqBy(resultData, 'order_id');
      setData(resultData);
      setCount(resultData?.length);
    } else {
      isEndReached.current = true;
    }
  };

  const _refreshing = async () => {
    setRefreshing(true);
    pageNumber.current = 1;
    preventLoader.current = false;
    isEndReached.current = false;
    initData();
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndReached.current) return;
    pageNumber.current += 1;
    showLoadMore(true);
    initData();
  };

  const _pressItem = (item, params = {}) => {
    dispatch(updateOrderState('orderDetails', item));
    navigation.navigate('orderDetails', {...params, refresh: _refreshing});
  };

  const _buyNow = async item => {
    const product = item.user_order_product[0] || {};

    const request = {
      product_id: product?.product_id,
      product_qty: product?.quantity,
      store_id: product?.store?.store_id,
      type: 'checkout',
    };
    if (product?.color_id) request.color_id = product?.color_id;
    if (product?.size_id) request.size_id = product?.size_id;
    dispatch(rootLoader(true));
    let res = await dispatch(productAddToCart(request));
    dispatch(rootLoader(false));
    navigation.navigate('confirmOrder');
  };

  const renderItem = ({item}) => {
    const product = item.user_order_product[0] || {};
    const status = product.status;
    let statusText = '';
    if (status === 0) statusText = 'Pending';
    else if (status === 1) statusText = 'Processing';
    else if (status === 2) statusText = 'Shipped';
    else if (status === 3 || status === 6 || status === 7)
      statusText = 'Delivered';
    else if (status === 4) statusText = 'Dispute';
    else if (status === 5) statusText = 'Cancelled';
    else if (status === 8 || status === 9) statusText = 'Refunded';

    return (
      <Pressable style={styles.item} onPress={() => _pressItem(item)}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.itemImg}
            source={{uri: product?.product_image}}
          />
          <View style={{flex: 1}}>
            <View style={styles.orderNumRow}>
              <Text style={styles.orderNumber}>#{item.order_number}</Text>
              <Icon
                name="chevron-right"
                size={moderateScale(20)}
                color={colors.black}
              />
            </View>
            <Text numberOfLines={2} style={styles.productName}>
              {product?.product_name}
            </Text>
            <View style={styles.row}>
              <Text style={styles.orderNumber}>
                Unit price : {product?.sub_total?.toFixed(2)}
              </Text>
              <Text style={styles.orderNumber}>Qty - {product?.quantity}</Text>
            </View>
            <Text style={styles.statusText}>Status : {statusText}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.itemFooter}>
          <Text style={styles.priceLabel}>
            Total Amount : Rs.{item.total_price?.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.fillButton}
            onPress={() => _buyNow(item)}>
            <Text style={styles.fillButtonText}>Buy Again</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (loadMore) {
      return (
        <View style={{padding: moderateScale(10), alignSelf: 'center'}}>
          <ActivityIndicator color={colors.white} size="small" />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.root}>
      <Header
        center
        title={
          title
            ? title + (count ? `(${count})` : '')
            : 'My Orders' + (count ? `(${count})` : '')
        }
        leadAction={
          <TouchableOpacity onPress={navigation.goBack} style={{padding: 15}}>
            <Image
              source={assets.backArrow}
              style={{resizeMode: 'contain', height: 25, width: 25}}
            />
          </TouchableOpacity>
        }
        // rightActions={
        //   <Menu
        //     visible={menuVisible}
        //     anchor={
        //       <TouchableOpacity
        //         style={styles.menuIc}
        //         onPress={() => setMenuVisible(true)}>
        //         <Icon
        //           name="filter-alt"
        //           size={moderateScale(24)}
        //           color={colors.white}
        //         />
        //       </TouchableOpacity>
        //     }
        //     onRequestClose={_closeMenu}>
        //     <MenuItem onPress={() => _menuAction()}>
        //       Extend Processing Time
        //     </MenuItem>
        //     <MenuDivider />
        //     <MenuItem onPress={() => _menuAction()}>Confirm Order</MenuItem>
        //     <MenuDivider />
        //     <MenuItem onPress={() => _menuAction()}>
        //       Request for Return/Replace
        //     </MenuItem>
        //     <MenuDivider />
        //   </Menu>
        // }
      />

      <SectionList
        sections={groupByDate(data)}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.listHeader}>{title}</Text>
        )}
        contentContainerStyle={{flexGrow: 1}}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        legacyImplementation
        refreshing={refreshing}
        onRefresh={_refreshing}
        onEndReached={_handleLoadMore}
        ListEmptyComponent={() => (
          <EmptyList message={'No order yet!'} isLoading={loader} />
        )}
        ListFooterComponent={renderFooter}
      />
      <SafeAreaView />
      {/* <SelectionPicker
        visible={menuVisible}
        onClose={() => showMenuVisible(false)}
        onChoose={_menuAction}
        dataOptions={ORDER_OPTION_MENU}
      /> */}
    </View>
  );
}

export default memo(MyOrders);

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
  listHeader: {
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 15,
    fontSize: 15,
    color: colors.black,
    fontFamily: env.fontBold,
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.black,
  },
  statusText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: colors.primary,
    marginTop: moderateScale(5),
  },
  itemImg: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
  },
  fillButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  fillButtonText: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.white,
  },
  priceLabel: {
    color: '#87879D',
    fontFamily: env.fontMedium,
    fontSize: 14,
  },
  divider: {
    backgroundColor: 'rgba(197, 206, 224, 0.25)',
    height: 1,
  },
  item: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.black,
    flex: 1,
  },
  productName: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(11),
    color: colors.black,
    opacity: 0.8,
    marginBottom: moderateScale(5),
  },
  orderNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(3),
  },
  menuIc: {
    paddingHorizontal: ms(10),
  },
});

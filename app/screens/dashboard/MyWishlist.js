/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToPrivateCategory,
  getWishlistCategory,
  getWishlistMainCategory,
  getWishlistProducts,
  productAddRemoveToWishlist,
  removeWishlistCategory,
  updateProductState,
} from '../../actions';
import EmptyList from '../../components/EmptyList';
import Header from '../../components/Header';
import {InputSelection} from '../../components/Inputs';
import CreateWishlist from '../../components/Modals/CreateWishlist';
import SelectionPicker from '../../components/Modals/SelectionPicker';
import Rating from '../../components/Rating';
import Selection from '../../components/Selection';
import {WISHLIST_OPTION_MENU} from '../../constants';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {navigate} from '../../navigation/RootNavigation';

function MyWishlist({navigation}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);
  const [createDialog, setCreateDialog] = useState(false);
  const [menuVisible, showMenuVisible] = useState(false);
  const [privateCatVisible, showPrivateCatVisible] = useState(false);
  const menuItemRef = useRef();
  const {
    wishlistProducts,
    wishlistCategories,
    mainCategories,
    selectedWishlistCategory,
    selectedMainCategory,
  } = useSelector(({product}) => product);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      initData();
    }
  }, []);

  const initData = async () => {
    await dispatch(getWishlistProducts());
    await dispatch(getWishlistMainCategory());
    await dispatch(getWishlistCategory());
    setRefreshing(false);
  };

  const _refreshing = async () => {
    if (!currentUser) {
      return null;
    }
    setRefreshing(true);
    initData();
  };

  if (!currentUser) {
    return (
      <EmptyList
        containStyle={{backgroundColor: colors.white}}
        message={'Login to access your wishlist.'}
        bottom={
          <Text onPress={() => navigate('auth')} style={styles.hyperLink}>
            Login to your account
          </Text>
        }
      />
    );
  }

  const _menuAction = async item => {
    await new Promise(resolve => setTimeout(resolve, 350));
    if (item.action === 'buy_now') {
      _productDetails(menuItemRef.current.display_product);
    } else if (item.action === 'addToCat') {
      showPrivateCatVisible(true);
    } else if (item.action === 'delete') {
      _removeProduct(menuItemRef.current);
    }
  };

  const _addToItemToPrivateCate = item => {
    dispatch(
      addToPrivateCategory({
        wishlist_id: menuItemRef.current.id,
        private_category_id: item.id,
      }),
    );
  };

  const _showMenu = item => {
    showMenuVisible(true);
    menuItemRef.current = item;
  };

  const _removeProduct = item => {
    Alert.alert('Delete!', 'Do you want to delete Wishlist?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          let tmpList = wishlistProducts?.filter(x => x.id != item.id);
          dispatch(updateProductState('wishlistProducts', tmpList));
          dispatch(
            productAddRemoveToWishlist({
              status: 0,
              product_id: item.product_id,
            }),
          );
        },
      },
    ]);
  };

  const _productDetails = data => {
    dispatch(updateProductState('productDetails', data));
    navigation.navigate('productDetails');
  };

  const _filterPrivateCategory = item => {
    if (item?.id === 'all') {
      item = null;
    }
    dispatch(updateProductState('selectedWishlistCategory', item));
    dispatch(getWishlistProducts());
  };

  const _filterMainCategory = item => {
    if (item.id === 'all') {
      item = null;
    }
    dispatch(updateProductState('selectedMainCategory', item));
    dispatch(getWishlistProducts());
  };

  const _removePrivateCategory = () => {
    Alert.alert(
      'Delete private list!',
      'Do you want to delete private category? All product in list will move to general wishlist.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dispatch(removeWishlistCategory());
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => {
    const product = item?.display_product;
    const feedbackRating = product?.feedback_rating;
    return (
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <Image style={styles.itemImg} source={{uri: product?.display_image}} />
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{flex: 1}}
                onPress={() => _productDetails(product)}>
                <Text numberOfLines={2} style={[styles.itemTitle, {flex: 1}]}>
                  {product?.product_name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{paddingLeft: 10}}
                onPress={() => _showMenu(item)}>
                <Icon
                  name="more-vert"
                  size={moderateScale(20)}
                  color={colors.black}
                />
              </TouchableOpacity>
            </View>
            <View style={{height: 5}} />
            <Text style={[styles.itemTitle, {fontSize: 13}]}>
              Rs. {product?.display_min_price}
              {'   '}
              {product?.display_max_price ? (
                <Text
                  style={{
                    color: '#F60101',
                    textDecorationLine: 'line-through',
                  }}>
                  Rs.{product?.display_max_price}
                </Text>
              ) : null}
            </Text>
            <View style={{height: 5}} />
            <Rating value={Number(feedbackRating?.avg_rate || 0)} />
          </View>
        </View>

        <View style={styles.itemFooter}>
          <View>
            <Text style={styles.footerText}>
              Added :{' '}
              {moment(product?.whishlist_post?.created_at).format(
                'Do, MMM YYYY',
              )}
            </Text>
            {/* <Text style={styles.footerText} numberOfLines={1}>
              {item.business_detail.CompanyName}
            </Text> */}
          </View>
          <TouchableOpacity
            style={styles.fillButton}
            onPress={() => _productDetails(product)}>
            <Text style={styles.fillButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.listHeader}>
        <View style={{flex: 1 / 2}}>
          <InputSelection
            placeholder="Main categories"
            containStyle={styles.inputSelection}
            options={mainCategories}
            value={selectedMainCategory?.name}
            onChangeText={_filterMainCategory}
          />
        </View>
        <View style={{width: moderateScale(10)}} />
        <View style={{flex: 1 / 2}}>
          <InputSelection
            placeholder="Private categories"
            containStyle={styles.inputSelection}
            options={wishlistCategories}
            value={selectedWishlistCategory?.name}
            onChangeText={_filterPrivateCategory}
          />
          {selectedWishlistCategory &&
          selectedWishlistCategory?.id !== 'all' ? (
            <TouchableOpacity onPress={_removePrivateCategory}>
              <Text style={styles.deleteCatText}>Delete category</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header
        title="My Wishlist"
        rightActions={
          <TouchableOpacity
            onPress={() => setCreateDialog(true)}
            style={{marginRight: moderateScale(10)}}>
            <Text style={styles.createText}>+ Create</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={wishlistProducts}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <EmptyList message={"You haven't added wishlist item yet."} />
        )}
        refreshing={refreshing}
        onRefresh={_refreshing}
      />
      <CreateWishlist
        isVisible={createDialog}
        onClose={() => setCreateDialog(false)}
      />
      <SelectionPicker
        visible={menuVisible}
        onClose={() => showMenuVisible(false)}
        onChoose={_menuAction}
        dataOptions={WISHLIST_OPTION_MENU}
      />
      <Selection
        isVisible={privateCatVisible}
        close={() => showPrivateCatVisible(false)}
        popupTitle="Select private category"
        data={wishlistCategories?.filter(x => x.id !== 'all')}
        onSelect={_addToItemToPrivateCate}
      />
    </View>
  );
}

export default MyWishlist;

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
  createText: {
    fontSize: moderateScale(12),
    color: colors.white,
    fontFamily: env.fontSemibold,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: moderateScale(20),
  },
  item: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImg: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(12),
    color: colors.black,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  fillButton: {
    backgroundColor: colors.primary,
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(20),
  },
  fillButtonText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.white,
  },
  hyperLink: {
    textDecorationLine: 'underline',
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
  },
  footerText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.black,
    lineHeight: moderateScale(18),
  },
  listHeader: {
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
    flexDirection: 'row',
  },
  inputSelection: {
    borderRadius: moderateScale(10),
    height: moderateScale(35),
  },
  deleteCatText: {
    color: colors.red,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(11),
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

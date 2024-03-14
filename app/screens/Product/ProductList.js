import _ from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {getProductsList, updateProductState} from '../../actions';
import assets from '../../assets';
import ProductItem from '../../components/Cards/ProductItem';
import EmptyList from '../../components/EmptyList';
import Header from '../../components/Header';
import {SearchInput} from '../../components/Inputs';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FilterModal from './FilterModal';

export default function ProductList({navigation, route}) {
  const {subCategory, isSearch, storeId, catId} = route.params || {};
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loader, showLoader] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(0);
  const preventLoader = useRef(false);
  const isEndReached = useRef(false);
  const searchTimeout = useRef();

  let title = 'Products';
  if (subCategory) title = subCategory.SubCatTitle;
  if (route.params?.title) title = route.params?.title;

  useEffect(() => {
    if (!isSearch) initData();
    else showLoader(false);
    return () => {
      dispatch(updateProductState('filterObj', {}));
      dispatch(updateProductState('apiFilterList', {}));
    };
  }, []);

  const initData = async () => {
    let params = {};
    if (subCategory) params.sub_category_id = subCategory.SubCatID;
    if (catId) params.category_id = catId;
    if (storeId) params.store_id = storeId;
    if (isSearch) params.search = searchText;

    params.page = pageNumber.current;
    params.limit = 10;
    let res = await dispatch(getProductsList(params));
    showLoader(false);
    showLoadMore(false);
    preventLoader.current = false;
    if (!res.data || !res.data?.length) {
      isEndReached.current = true;
      return;
    }
    let resultData = [...data, ...res.data];
    resultData = _.uniqBy(resultData, 'product_id');
    setData(resultData);
  };

  const _change = (searchText) => {
    setSearchText(searchText);
    searchText = searchText.trim();
    if (searchText === '') return setData([]);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }
    if (searchText.length <= 3) return null;
    searchTimeout.current = setTimeout(async () => {
      showLoader(true);
      const searchData = await dispatch(
        getProductsList({
          search: searchText,
          page: 0,
          limit: 10,
        }),
      );
      showLoader(false);
      if (searchData?.data?.length) setData(searchData?.data);
      searchTimeout.current = null;
    }, 300);
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndReached.current) return;
    pageNumber.current += 1;
    preventLoader.current = true;
    showLoadMore(true);
    initData();
  };

  const _searchProducts = () => {
    if (!searchText) return;
    _refreshData();
  };

  const _refreshData = () => {
    showLoader(true);
    pageNumber.current = 0;
    isEndReached.current = false;
    preventLoader.current = false;
    setData([]);
    initData();
  };

  const _filterPress = () => {
    dispatch(updateProductState('showFilterModal', true));
  };

  const renderItem = ({item}) => {
    return <ProductItem data={item} />;
  };

  return (
    <View style={styles.root}>
      {!isSearch ? (
        <Header
          title={isSearch ? '' : title}
          isBack
          rightActions={
            <TouchableOpacity style={styles.filterBtn} onPress={_filterPress}>
              <Icon
                name="filter-alt"
                color={colors.white}
                size={moderateScale(20)}
              />
            </TouchableOpacity>
          }
        />
      ) : (
        <>
          <SafeAreaView />
          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={navigation.goBack}
              style={{padding: ms(10)}}>
              <Image source={assets.backArrow} style={styles.backIc} />
            </TouchableOpacity>
            <View style={{flex: 1, marginRight: ms(10)}}>
              <SearchInput
                value={searchText}
                onChangeText={_change}
                onSubmitEditing={_searchProducts}
                placeholder="Search..."
                containStyle={{backgroundColor: colors.lightGray}}
                autoFocus={isSearch}
                right={
                  searchText ? (
                    <TouchableOpacity
                      style={{marginLeft: 10}}
                      onPress={() => setSearchText('')}>
                      <Image
                        source={assets.fill_close}
                        style={styles.searchCloseIc}
                      />
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={_filterPress}>
              <Icon
                name="filter-alt"
                color={colors.primary}
                size={moderateScale(20)}
              />
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={{flex: 1}}>
        <FlatList
          data={data}
          keyExtractor={(it, i) => String(i)}
          numColumns={2}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
          scrollIndicatorInsets={{right: 1}}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          legacyImplementation
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <EmptyList isLoading={loader} message={'No product found.'} />
          )}
          ListFooterComponent={() => {
            if (loadMore) {
              return (
                <View style={styles.footer}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              );
            }
            return null;
          }}
        />
      </View>

      {/* FILTER MODAL */}
      <FilterModal onApply={_refreshData} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterBtn: {
    marginRight: moderateScale(10),
  },
  searchContainer: {
    height: moderateScale(50),
    // paddingHorizontal: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchCloseIc: {
    resizeMode: 'contain',
    height: moderateScale(18),
    width: moderateScale(18),
  },
  contentContainerStyle: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    flexGrow: 1,
  },
  footer: {
    padding: 10,
    alignSelf: 'center',
  },
  backIc: {
    resizeMode: 'contain',
    height: moderateScale(25),
    width: moderateScale(25),
    tintColor: colors.primary,
  },
});

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {getSubCategoryList} from '../../actions/meta';
import assets from '../../assets';
import Header from '../../components/Header';
import colors from '../../constants/colors';
import env from '../../constants/env';
import _ from 'lodash';
import EmptyList from '../../components/EmptyList';
import {useDispatch, useSelector} from 'react-redux';

function Categories({navigation, route}) {
  const dispatch = useDispatch();
  const {categories} = useSelector(({meta}) => meta);
  const category = route.params?.data;
  const [data, setData] = useState([]);
  const [loader, showLoader] = useState(true);

  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(0);
  const preventLoader = useRef(false);
  const isEndReached = useRef(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async (params = {}) => {
    if (!category) {
      return setData(categories);
    }
    params.category_id = category.CatID;
    params.page = pageNumber.current;
    params.limit = 20;
    let res = await dispatch(getSubCategoryList(params));
    showLoader(false);
    showLoadMore(false);
    preventLoader.current = false;
    if (!category) return setData(res);
    const catData = res?.data[0];
    if (!catData || !catData?.get_data_by_cat?.length) {
      isEndReached.current = true;
      return;
    }
    let resultData = [...data, ...catData?.get_data_by_cat];
    resultData = _.uniqBy(resultData, 'SubCatID');
    setData(resultData);
  };

  const getSubcategories = (item) => {
    // navigation.push('categories', {data: item});
    navigation.navigate('productList', {catId: item.CatID, title: item?.CatTitle});
  };

  const subCategoryPress = (item) => {
    navigation.navigate('productList', {subCategory: item});
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndReached.current || !category)
      return;
    pageNumber.current += 1;
    preventLoader.current = true;
    showLoadMore(true);
    initData();
  };

  const renderItem = ({item}) => {
    if (item?.SubCatID)
      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => subCategoryPress(item)}>
          <Image source={{uri: item.SubCatImage}} style={styles.leadingIcon} />
          <Text style={styles.itemTitle}>{item.SubCatTitle}</Text>
          <Image source={assets.arrow_right_ic} style={styles.rightIcon} />
        </TouchableOpacity>
      );

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => getSubcategories(item)}>
        <Image source={{uri: item.CatImage}} style={styles.leadingIcon} />
        <Text style={styles.itemTitle}>{item.CatTitle}</Text>
        <Image source={assets.arrow_right_ic} style={styles.rightIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <Header title={category ? category?.CatTitle : 'Categories'} isBack />
      <FlatList
        data={data}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={() => (
          <EmptyList message="No data found." isLoading={loader} />
        )}
        scrollIndicatorInsets={{right: 1}}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        legacyImplementation
        onEndReached={_handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (loadMore) {
            return (
              <View style={{padding: 10, alignSelf: 'center'}}>
                <ActivityIndicator color={colors.primary} />
              </View>
            );
          }
          return null;
        }}
      />
      <SafeAreaView />
    </View>
  );
}

export default Categories;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 206, 224, 0.25)',
    marginLeft: 15,
    paddingRight: 15,
  },
  leadingIcon: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
  },
  itemTitle: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: '#87879D',
    marginLeft: 10,
    flex: 1,
  },
  rightIcon: {
    resizeMode: 'contain',
    height: 12,
    width: 12,
    tintColor: '#87879D',
  },
});

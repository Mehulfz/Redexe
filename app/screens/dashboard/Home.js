import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import assets from '../../assets';
import Categories from '../../components/Cards/Categories';
import ProductItem from '../../components/Cards/ProductItem';
import Header from '../../components/Header';
import MainSlider from '../../components/MainSlider';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {getCategoryList, getProductsList} from '../../actions';
import _ from 'lodash';
import {useSelector} from 'react-redux';
import {ms} from 'react-native-size-matters';

export default function Home({navigation}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);

  const [data, setData] = useState([]);
  const [loader, showLoader] = useState(true);
  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(0);
  const preventLoader = useRef(false);
  const isEndReached = useRef(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getCategoryList());
    initData();
  }, []);

  const initData = async () => {
    let params = {};
    params.page = pageNumber.current;
    params.limit = 10;
    let res = await dispatch(getProductsList(params));
    showLoader(false);
    showLoadMore(false);
    setRefreshing(false);
    preventLoader.current = false;
    if (!res.data || !res.data?.length) {
      isEndReached.current = true;
      return;
    }
    let resultData = [...data, ...res.data];
    resultData = _.uniqBy(resultData, 'product_id');
    setData(resultData);
  };

  const _refreshing = async () => {
    setRefreshing(true);
    pageNumber.current = 0;
    preventLoader.current = false;
    isEndReached.current = false;
    initData();
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndReached.current) return;
    pageNumber.current += 1;
    preventLoader.current = true;
    showLoadMore(true);
    initData();
  };

  const renderItem = ({item}) => {
    return <ProductItem data={item} />;
  };

  const renderHeader = () => {
    return (
      <View>
        <MainSlider />
        <View style={{height: 15}} />
        <View style={styles.widgetTitleArea}>
          <Text style={styles.widgetTitle}>Categories</Text>
          {/* <TouchableOpacity
            style={{padding: 5}}
            onPress={() => navigation.navigate('categories')}>
            <Text style={styles.moreTitle}>View all</Text>
          </TouchableOpacity> */}
        </View>
        <Categories />
        <View style={{height: 15}} />
        <View style={styles.widgetTitleArea}>
          <Text style={styles.widgetTitle}>Fall in love with collection</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header
        rightActions={
          <View style={styles.row}>
            {/* <TouchableOpacity
              style={{padding: 10}}
              onPress={() =>
                navigation.navigate(currentUser ? 'profile' : 'auth')
              }>
              <Image source={assets.account_ic} style={styles.actionIcon} />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{padding: 10, paddingRight: 15}}
              onPress={() =>
                navigation.navigate('productList', {isSearch: true})
              }>
              <Image source={assets.search_icon} style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={{flex: 1}}>
        <FlatList
          data={data}
          keyExtractor={(it, i) => String(i)}
          numColumns={2}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: 5, paddingBottom: 10}}
          ListHeaderComponent={renderHeader}
          scrollIndicatorInsets={{right: 1}}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          legacyImplementation
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={_refreshing}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.hexadecimal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    tintColor: colors.white,
    resizeMode: 'contain',
    height: ms(24),
    width: ms(24),
  },
  widgetTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: ms(10),
    paddingVertical: ms(10),
  },
  widgetTitle: {
    fontFamily: env.fontSemibold,
    fontSize: ms(15),
    color: '#222B45',
  },
  moreTitle: {
    fontFamily: env.fontRegular,
    fontSize: ms(14),
    color: '#222B45',
  },
});

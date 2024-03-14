import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import colors from '../../../constants/colors';
import Header from '../../../components/Header';
import {useDispatch} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import EmptyList from '../../../components/EmptyList';
import _ from 'lodash';
import {getSellerFeedback, likeUnlikeFeedback} from '../../../actions';
import Rating from '../../../components/Rating';
import env from '../../../constants/env';
import moment from 'moment';
import assets from '../../../assets';
import OrderFeedbackModal from '../../../components/Modals/OrderFeedbackModal';
export default function SellerFeedback() {
  const dispatch = useDispatch();
  const [refreshing, showRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [loader, showLoader] = useState(true);
  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(1);
  const preventLoader = useRef(false);
  const isEndRich = useRef(false);
  const forceUpdate = React.useReducer(bool => !bool)[1];

  const [feedbackModalVisible, showFeedbackModalVisible] = useState(false);
  const feedbackItem = useRef();
  const feedbackType = useRef('add');

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let res = await getSellerFeedback({page: pageNumber.current});
    showLoader(false);
    showLoadMore(false);
    showRefreshing(false);
    preventLoader.current = false;
    if (!res.data || !res.data?.length) {
      isEndRich.current = true;
      return;
    }
    let resultData =
      pageNumber.current == 1 ? res.data : [...data, ...res.data];
    resultData = _.uniqBy(resultData, 'user_order_products_id');
    setData(resultData);
  };

  const onRefresh = () => {
    preventLoader.current = false;
    isEndRich.current = false;
    pageNumber.current = 1;
    showRefreshing(true);
    initData();
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndRich.current) return;
    pageNumber.current += 1;
    showLoadMore(true);
    initData();
  };

  const _leaveFeedback = item => {
    feedbackItem.current = item;
    feedbackType.current = 'add';
    showFeedbackModalVisible(true);
  };

  const _viewFeedback = item => {
    feedbackItem.current = item;
    feedbackType.current = 'view';
    showFeedbackModalVisible(true);
  };

  const _likeUnlike = (item, action, index) => {
    likeUnlikeFeedback({
      user_order_products_id: item.user_order_products_id,
      product_id: item.product_id,
      product_feedback: action,
    });
    const likeStatus = item?.user_like_unlike_product?.product_feedback;
    setData(pre => {
      if (!item?.user_like_unlike_product) {
        pre[index].user_like_unlike_product = {};
      }
      pre[index].user_like_unlike_product.product_feedback = action;
      if (action == 1) {
        pre[index].like_product_count += 1;
        if (likeStatus == 0) pre[index].unlike_product_count -= 1;
      } else {
        pre[index].unlike_product_count += 1;
        if (likeStatus == 1) pre[index].like_product_count -= 1;
      }
      return pre;
    });
    forceUpdate();
  };

  const renderItem = ({item, index}) => {
    const feedback = item.user_feedback;
    const product = item.product;

    const likeStatus = item?.user_like_unlike_product?.product_feedback;
    return (
      <View style={styles.item}>
        <View style={styles.itemLeftContainer}>
          <Image style={styles.itemImg} source={{uri: item.product_image}} />
          {feedback ? (
            <TouchableOpacity onPress={() => _viewFeedback(item)}>
              <Rating
                value={feedback?.feedback_rating}
                size={moderateScale(10)}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => _leaveFeedback(item)}>
              <Text style={styles.hyperLink}>Leave feedback</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.itemRightContainer}>
          <Text numberOfLines={2} style={styles.productName}>
            {item?.product_name}
          </Text>
          <Text style={styles.orderText}>
            Order Placed :{' '}
            {moment(item.product_order_date_time).format('DD-MMM-YYYY HH:mm')}
          </Text>
          {item?.order_number ? (
            <Text style={styles.orderText}>
              Order Number : {item?.order_number}
            </Text>
          ) : null}

          <View style={{flex: 1}} />
          <View style={styles.actionContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                disabled={likeStatus == 1}
                onPress={() => _likeUnlike(item, 1, index)}>
                <Image
                  source={assets.likeIcon}
                  style={[
                    styles.actionIcon,
                    {
                      tintColor:
                        likeStatus == 1 ? colors.primary : colors.darkGray,
                    },
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.actionCountText}>
                {item?.like_product_count}
              </Text>
            </View>
            <View style={{width: moderateScale(15)}} />
            <View style={styles.row}>
              <TouchableOpacity
                disabled={likeStatus == 0}
                onPress={() => _likeUnlike(item, 0, index)}>
                <Image
                  source={assets.dislikeIcon}
                  style={[
                    styles.actionIcon,
                    {
                      tintColor:
                        likeStatus == 0 ? colors.primary : colors.darkGray,
                    },
                  ]}
                />
              </TouchableOpacity>
              <Text style={styles.actionCountText}>
                {item?.unlike_product_count}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header title={'Seller Feedback'} isBack />
      <FlatList
        data={data}
        keyExtractor={(x, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <EmptyList
            message={'No feedback from customer yet!'}
            isLoading={loader}
          />
        )}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        legacyImplementation
        onEndReached={_handleLoadMore}
        ListFooterComponent={() => {
          if (loadMore) {
            return (
              <View style={{padding: moderateScale(10), alignSelf: 'center'}}>
                <ActivityIndicator color={colors.white} size="small" />
              </View>
            );
          }
          return null;
        }}
      />

      {/* HIDDEN COMPONENTS */}
      <OrderFeedbackModal
        isVisible={feedbackModalVisible}
        onClose={() => showFeedbackModalVisible(false)}
        item={feedbackItem.current}
        listRefresh={onRefresh}
        type={feedbackType.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainerStyle: {
    flexGrow: 1,
    padding: moderateScale(15),
  },
  item: {
    padding: moderateScale(10),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(15),
    flexDirection: 'row',
  },
  itemLeftContainer: {
    alignItems: 'center',
  },
  itemImg: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: 10,
    marginBottom: moderateScale(5),
  },
  hyperLink: {
    fontSize: moderateScale(12),
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: env.fontRegular,
  },
  itemRightContainer: {
    flex: 1,
    marginLeft: moderateScale(10),
  },
  productName: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.black,
    opacity: 0.8,
    marginBottom: moderateScale(8),
  },
  orderText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(11),
    color: colors.black,
    opacity: 0.8,
    lineHeight: moderateScale(16),
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    height: moderateScale(14),
    width: moderateScale(14),
    resizeMode: 'contain',
    marginRight: moderateScale(5),
  },
  actionCountText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.black,
    opacity: 0.8,
  },
});

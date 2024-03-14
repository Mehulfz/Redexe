import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteRefundPayment,
  getRefundUPIPayments,
  getRefundBankPayments,
  setDefaultRefundPayment,
  updateUserState,
} from '../../../../actions';
import {ActionButton} from '../../../../components/Buttons';
import EmptyList from '../../../../components/EmptyList';
import Header from '../../../../components/Header';
import colors from '../../../../constants/colors';
import env from '../../../../constants/env';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

export default function RefundPayments({navigation}) {
  const dispatch = useDispatch();
  const {refundBankPayments, refundUPIPayments, currentUser} = useSelector(
    ({user}) => user,
  );
  const [loader, showLoader] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(1);
  const preventLoader = useRef(false);
  const isEndRich = useRef(false);

  useEffect(() => {
    pageNumber.current = 1;
    preventLoader.current = false;
    isEndRich.current = false;
    initData();
  }, [selectedIndex]);

  const initData = async () => {
    if (preventLoader.current) return;
    preventLoader.current = true;
    let res;
    if (selectedIndex == 0) {
      res = await dispatch(getRefundBankPayments({page: pageNumber.current}));
    } else {
      res = await dispatch(getRefundUPIPayments({page: pageNumber.current}));
    }
    showLoader(false);
    showLoadMore(false);
    preventLoader.current = false;
    if (!res || !res?.length || res?.length < 20) isEndRich.current = true;
  };

  const _handleLoadMore = () => {
    if (loadMore || preventLoader.current || isEndRich.current) return;
    pageNumber.current += 10;
    showLoadMore(true);
    initData();
  };

  const _editItem = (item) => {
    navigation.navigate('addRefundPayment', {
      type: selectedIndex == 0 ? 'bank' : 'upi',
      editData: item
    })
  };

  const _deleteItem = (item) => {
    Alert.alert('Delete!', 'Do you want to delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          let tmpList =
            selectedIndex == 0 ? refundBankPayments : refundUPIPayments;
          tmpList = tmpList?.filter((x) => x.id != item.id);
          dispatch(
            updateUserState(
              selectedIndex == 0 ? 'refundBankPayments' : 'refundUPIPayments',
              tmpList,
            ),
          );
          dispatch(deleteRefundPayment(item.id));
        },
      },
    ]);
  };

  const _setDefaultItem = (item) => {
    dispatch(setDefaultRefundPayment(item.id));
  };

  const renderItem = ({item}) => {
    const isDefault = item.id == currentUser?.refund_payment_data?.id;
    return (
      <View style={styles.item}>
        {item?.upi_number ? (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>UPI Name : </Text>
              <Text style={styles.itemText}>{item.upi_name}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>UPI Number : </Text>
              <Text style={styles.itemText}>{item.upi_number}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>Bank Name : </Text>
              <Text style={styles.itemText}>{item.bank_name}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>Account Number : </Text>
              <Text style={styles.itemText}>{item.account_number}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>IFSC : </Text>
              <Text style={styles.itemText}>{item.ifsc}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>Branch : </Text>
              <Text style={styles.itemText}>{item.branch}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>City : </Text>
              <Text style={styles.itemText}>{item.city}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.itemText}>State : </Text>
              <Text style={styles.itemText}>{item.state_data?.name || ''}</Text>
            </View>
          </>
        )}

        {/* Buttons */}
        <View style={styles.itemBtnContainer}>
          <TouchableOpacity onPress={() => _editItem(item)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          {!isDefault && !item?.upi_number ? (
            <TouchableOpacity
              disabled={isDefault}
              onPress={() => _setDefaultItem(item)}>
              <Text style={styles.setDefaultText}>Set Default </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => _deleteItem(item)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header title={'Refund payments'} isBack />
      <SegmentedControl
        values={['Bank Details', 'UPI Details']}
        selectedIndex={selectedIndex}
        onChange={({nativeEvent}) =>
          setSelectedIndex(nativeEvent.selectedSegmentIndex)
        }
        style={{
          marginHorizontal: moderateScale(15),
          marginVertical: moderateScale(10),
        }}
      />
      <FlatList
        data={selectedIndex ? refundUPIPayments : refundBankPayments}
        keyExtractor={(x, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={() => (
          <EmptyList message={'No refund payment added!'} isLoading={loader} />
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
      <ActionButton
        onPress={() =>
          navigation.navigate('addRefundPayment', {
            type: selectedIndex == 0 ? 'bank' : 'upi',
          })
        }
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
    padding: moderateScale(15),
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
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(3),
  },
  itemText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: colors.black,
    opacity: 0.7,
  },
  itemBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: moderateScale(10),
  },
  editText: {
    color: '#007bff',
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    paddingHorizontal: moderateScale(10),
  },
  setDefaultText: {
    color: 'green',
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    paddingHorizontal: moderateScale(10),
  },
  deleteText: {
    color: colors.red,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    paddingLeft: moderateScale(10),
  },
});

/* eslint-disable react-native/no-inline-styles */
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
  deleteAddress,
  getAddress,
  setDefaultAddress,
  updateUserState,
} from '../../../../actions';
import {ActionButton} from '../../../../components/Buttons';
import EmptyList from '../../../../components/EmptyList';
import Header from '../../../../components/Header';
import colors from '../../../../constants/colors';
import env from '../../../../constants/env';
import {formatPhoneNumber} from '../../../../utils/arrayOperations';

export default function ManageAddress({navigation}) {
  const dispatch = useDispatch();
  const {myAddress} = useSelector(({user}) => user);
  const [loader, showLoader] = useState(true);

  const [loadMore, showLoadMore] = useState(false);
  const pageNumber = useRef(1);
  const preventLoader = useRef(false);
  const isEndRich = useRef(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    if (preventLoader.current) return;
    preventLoader.current = true;
    const res = await dispatch(getAddress({page: pageNumber.current}));
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

  const _editAddress = item => {
    navigation.navigate('deliveryLocation', {editData: item});
  };

  const _setDefaultAddress = item => {
    dispatch(setDefaultAddress(item.id));
  };

  const _deleteAddress = item => {
    Alert.alert('Delete!', 'Do you want to delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          let tmpList = myAddress?.filter(x => x.id != item.id);
          dispatch(updateUserState('myAddress', tmpList));
          dispatch(deleteAddress(item.id));
        },
      },
    ]);
  };

  const renderItem = ({item}) => {
    const isDefault = item.is_default == 1;
    return (
      <View style={styles.item}>
        <Text style={styles.username}>
          {item?.name}{' '}
          {isDefault ? (
            <View style={styles.defaultLabel}>
              <Text style={styles.defaultLabelText}>Default</Text>
            </View>
          ) : null}{' '}
        </Text>
        <Text style={styles.addressText}>
          {item?.address1} {item?.address2}
        </Text>
        <Text style={styles.addressText}>
          {item.city}, {item?.state?.name}-{item.pin_code}
        </Text>
        <Text style={styles.addressText}>
          {formatPhoneNumber(item.phone_number)}
        </Text>

        {/* Buttons */}
        <View style={styles.itemBtnContainer}>
          <TouchableOpacity onPress={() => _editAddress(item)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          {!isDefault ? (
            <TouchableOpacity
              disabled={isDefault}
              onPress={() => _setDefaultAddress(item)}>
              <Text style={styles.setDefaultText}>Set Default </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => _deleteAddress(item)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header title={'Manage Address'} isBack />
      <FlatList
        data={myAddress}
        keyExtractor={(x, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={() => (
          <EmptyList message={'No address added!'} isLoading={loader} />
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
      <ActionButton onPress={() => navigation.navigate('deliveryLocation')} />
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
  username: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.black,
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(5),
  },
  addressText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: colors.black,
    opacity: 0.7,
  },
  defaultLabel: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(2),
  },
  defaultLabelText: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontFamily: env.fontRegular,
  },
  itemBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: moderateScale(5),
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
    paddingHorizontal: moderateScale(10),
  },
});

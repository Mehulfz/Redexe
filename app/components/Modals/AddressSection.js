import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, ms} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {getAddress} from '../../actions';
import assets from '../../assets';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Button} from '../Buttons';

export default function AddressSection({show, selectedId, close, onSelect}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const {myAddress} = useSelector(({user}) => user);

  // useEffect(() => {
  //   if (!myAddress?.length) {
  //     dispatch(getAddress());
  //   }
  // }, []);

  const _closeModal = () => {
    if (close) {
      close();
    }
  };

  const _changeAddress = item => {
    if (onSelect) {
      onSelect(item);
    }
    close();
  };

  const _addNewAddress = () => {
    close();
    navigation.navigate('deliveryLocation', {onAdded: _changeAddress});
  };

  const renderItem = ({item}) => {
    const IsActive = item?.id === selectedId;
    return (
      <TouchableOpacity style={styles.row} onPress={() => _changeAddress(item)}>
        <View style={styles.item}>
          <Text style={styles.homeText}>{item?.title}</Text>
          <Text style={styles.homeAddressText} numberOfLines={1}>
            {item?.address1} {item?.address2}, {item.city}, {item?.state?.name}-
            {item.pin_code}
          </Text>
        </View>
        <View
          style={[styles.radio, IsActive && {backgroundColor: colors.primary}]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={show}
      style={styles.root}
      onBackdropPress={_closeModal}
      onBackButtonPress={_closeModal}
      backdropOpacity={0.3}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Select address</Text>
          <TouchableOpacity onPress={_closeModal}>
            <Image source={assets.close_ic} style={styles.closeIc} />
          </TouchableOpacity>
        </View>
        <View style={{height: ms(20)}} />
        <FlatList
          data={myAddress}
          keyExtractor={(x, i) => String(i)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{minHeight: ms(150)}}
        />
        <Text style={styles.addNewAddress} onPress={_addNewAddress}>
          Add New Address
        </Text>
        {/* <Button
          title={'Submit'}
          titleStyle={{
            fontFamily: env.fontMedium,
            fontSize: ms(16),
          }}
          containerStyle={{
            height: ms(45),
          }}
          onPress={close}
        /> */}
        {/* <View style={{height: bottom}} /> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.white,
    padding: moderateScale(20),
    maxHeight: Dimensions.get('window').height * 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: env.fontSemibold,
    color: colors.label,
    fontSize: moderateScale(18),
    flex: 1,
  },
  closeIc: {
    height: moderateScale(14),
    width: moderateScale(14),
    resizeMode: 'contain',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    paddingVertical: ms(12),
    flex: 1,
  },
  homeText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(17),
    color: colors.black,
  },
  homeAddressText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(15),
    color: '#7D849A',
    marginTop: ms(5),
  },
  addNewAddress: {
    fontFamily: env.fontMedium,
    color: colors.primary,
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginVertical: ms(20),
    textDecorationLine: 'underline',
  },
  radio: {
    borderWidth: ms(2),
    height: ms(15),
    width: ms(15),
    borderRadius: ms(15),
    borderColor: colors.primary,
  },
});

import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, ms, scale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {updateProfilePicture} from '../../actions';
import assets from '../../assets';
import Avatar from '../../components/Avatar';
import Header from '../../components/Header';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {formatPhoneNumber} from '../../utils/arrayOperations';
import {openPhotos} from '../../utils/fileOperations';

function Profile({navigation}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);

  const _profilePicker = async () => {
    const response = await openPhotos({
      width: 200,
      height: 200,
      cropping: true,
      includeBase64: true,
    });
    dispatch(
      updateProfilePicture({
        profile_image: 'data:image/jpg;base64,' + response.base64,
      }),
    );
  };

  const renderDefaultAddress = () => {
    const item = currentUser?.manage_address_data || {};
    return (
      <View style={[styles.inputFillContainer]}>
        <Text style={styles.title}>Default Shipping address</Text>
        {item?.id ? (
          <Text style={styles.valueText}>
            {item?.address1} {item?.address2} {'\n'}
            {item.city}, {item?.state?.name}-{item.pin_code}
          </Text>
        ) : null}
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => navigation.navigate('manageAddress')}>
          <Text style={styles.hyperlinkText}>
            Change default shipping address
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRefundPayment = () => {
    const payment = currentUser?.refund_payment_data || {};
    return (
      <View style={[styles.inputFillContainer]}>
        <Text style={styles.title}>Default refund payment</Text>
        {payment?.id ? (
          <Text style={styles.valueText}>
            {payment?.bank_name} : {payment?.account_number}
          </Text>
        ) : null}

        <TouchableOpacity style={{marginTop: 10}}>
          <Text
            style={styles.hyperlinkText}
            onPress={() => navigation.navigate('refundPayments')}>
            Change default refund payment
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header
        title="Profile"
        isBack
        rightActions={
          <TouchableOpacity
            style={{padding: ms(10), marginRight: ms(5)}}
            onPress={() =>
              navigation.navigate('editProfile')
            }>
            <Text style={{color: colors.white, fontSize: ms(14), fontFamily: env.fontRegular }}>Edit</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userContainer}>
          <Avatar
            size={scale(100)}
            source={{uri: currentUser?.profile_image}}
          />
          <TouchableOpacity onPress={_profilePicker} style={styles.editBtn}>
            <Image source={assets.edit_ic} style={styles.edit_ic} />
          </TouchableOpacity>
        </View>

        <View style={{padding: 15}}>
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Name</Text>
            <Text style={styles.valueText}>
              {currentUser?.first_name} {currentUser?.last_name}
            </Text>
          </View>
          {currentUser?.email ? (
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.valueText}>{currentUser?.email}</Text>
            </View>
          ) : null}
          {currentUser?.address1 ? (
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Address</Text>
              <Text style={styles.valueText}>
                {currentUser?.address1} {currentUser?.address2} {'\n'}
                {currentUser.city}, {currentUser?.state_data?.name}-
                {currentUser.pin_code}
              </Text>
            </View>
          ) : null}
          {currentUser?.phone_number ? (
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Contact number</Text>
              <Text style={styles.valueText}>
                {formatPhoneNumber(currentUser?.phone_number)}
              </Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('changePassword')}>
          <Text style={styles.title}>Change Password</Text>
          <Image source={assets.arrow_right_ic} style={styles.arrowRight} />
        </TouchableOpacity>
        {renderDefaultAddress()}
        {renderRefundPayment()}
        {/* <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('setGST')}>
          <Text style={styles.title}>Photo id proof</Text>
          <Image source={assets.arrow_right_ic} style={styles.arrowRight} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('setGST')}>
          <Text style={styles.title}>Set GST number</Text>
          <Image source={assets.arrow_right_ic} style={styles.arrowRight} />
        </TouchableOpacity>
      </ScrollView>
      <SafeAreaView />
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRightText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: env.fontRegular,
    marginHorizontal: 15,
  },
  userContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: colors.black,
    fontFamily: env.fontMedium,
  },
  valueText: {
    fontSize: 16,
    color: '#87879D',
    fontFamily: env.fontMedium,
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  hyperlinkText: {
    fontSize: 18,
    color: '#0089B4',
    fontFamily: env.fontMedium,
    textDecorationLine: 'underline',
  },
  inputFillContainer: {
    marginBottom: 5,
    backgroundColor: 'rgba(197, 206, 224, 0.18)',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E7E7E7',
    padding: 15,
  },
  edit_ic: {
    resizeMode: 'contain',
    height: 18,
    width: 18,
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: moderateScale(30),
    padding: moderateScale(8),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(197, 206, 224, 0.18)',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E7E7E7',
    padding: 15,
    marginBottom: 5,
  },
  arrowRight: {
    resizeMode: 'contain',
    height: moderateScale(14),
    width: moderateScale(14),
  },
});

/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale, ms} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {getAddress} from '../../actions';
import {AddGSTDialog} from '../../components/Modals/AddGSTDialog';
import AddressSection from '../../components/Modals/AddressSection';
import colors from '../../constants/colors';
import env from '../../constants/env';

export const DeliveryDetails = ({
  shipping,
  billing,
  onChange,
  gstDetails,
  IsGSTInvoice,
  setIsGSTInvoice,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {myAddress} = useSelector(({user}) => user);
  const [addressDialog, setAddressDialog] = useState(false);

  const addressAction = useRef();
  const [gstDialog, showGstDialog] = useState(false);

  const addressExists = myAddress?.length ? true : false;

  useEffect(() => {
    if (!addressExists) {
      dispatch(getAddress());
    }
  }, []);

  const _changeAddress = action => {
    addressAction.current = action;
    if (addressExists) {
      setAddressDialog(true);
    } else {
      navigation.navigate('deliveryLocation', {onAdded: _addressSelect});
    }
  };

  const _addressSelect = address => {
    onChange(address, addressAction.current);
  };

  const _updateGST = data => {
    onChange(data, 'gst');
  };

  const renderGST = () => {
    return (
      <View>
        <View style={styles.rowCenter}>
          <TouchableOpacity
            style={styles.gstBtn}
            onPress={() => setIsGSTInvoice(!IsGSTInvoice)}>
            <Icon
              name={IsGSTInvoice ? 'checkbox-outline' : 'square-outline'}
              size={ms(24)}
              color={colors.primary}
            />
            <Text style={styles.gstBtnTitle}>Use GST Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showGstDialog(true)}
            style={{marginBottom: ms(10)}}>
            <Text style={styles.changeText}>
              {gstDetails ? 'Change' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
        {gstDetails ? (
          <>
            <Text style={styles.gstDetailsText}>
              {gstDetails?.company_name}
            </Text>
            <Text style={styles.gstDetailsText}>{gstDetails?.gst_no}</Text>
            <View style={{height: ms(15)}} />
          </>
        ) : null}
      </View>
    );
  };

  return (
    <View style={{flex: 1, margin: moderateScale(20)}}>
      <View style={styles.contain}>
        <Text style={styles.addressTitle}>Delivery Address</Text>
        <TouchableOpacity
          onPress={() => _changeAddress('Delivery')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.changeText}>
            {addressExists ? 'Change' : 'Add'}
          </Text>
          {/* <Image source={assets.arrow_right_ic} style={styles.rightArrowIc} /> */}
        </TouchableOpacity>
      </View>
      <View style={{marginTop: ms(15)}} />
      {shipping ? (
        <>
          <Text style={[styles.addressTitle, {opacity: 0.7}]}>
            {shipping?.title}
          </Text>
          <Text style={styles.addressText}>
            {shipping?.address1} {shipping?.address2}, {shipping?.city},{' '}
            {shipping?.state?.name} - {shipping?.pin_code}
          </Text>
        </>
      ) : null}

      <View
        style={{borderBottomWidth: 1, borderBottomColor: colors.lightGray}}
      />
      <View style={{marginTop: moderateScale(15)}} />
      <View style={styles.contain}>
        <Text style={styles.addressTitle}>Billing Address</Text>
        <TouchableOpacity
          onPress={() => _changeAddress('Billing')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.changeText}>
            {addressExists ? 'Change' : 'Add'}
          </Text>
          {/* <Image source={assets.arrow_right_ic} style={styles.rightArrowIc} /> */}
        </TouchableOpacity>
      </View>
      {billing ? (
        <Text style={styles.addressText}>
          {billing?.address1} {billing?.address2}, {billing?.city},{' '}
          {billing?.state?.name}-{billing?.pin_code}
        </Text>
      ) : (
        <View style={{marginTop: ms(15)}} />
      )}
      <View
        style={{borderBottomWidth: 1, borderBottomColor: colors.lightGray}}
      />
      <View style={{marginTop: ms(20)}} />
      {renderGST()}

      <View
        style={{borderBottomWidth: 1, borderBottomColor: colors.lightGray}}
      />
      <AddressSection
        show={addressDialog}
        close={() => setAddressDialog(false)}
        onSelect={_addressSelect}
        selectedId={
          addressAction.current === 'Delivery' ? shipping?.id : billing?.id
        }
      />
      <AddGSTDialog
        isVisible={gstDialog}
        onClose={() => showGstDialog(false)}
        data={gstDetails}
        onSubmit={_updateGST}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(5),
  },
  deliveryAddressText: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(18),
    color: colors.black,
  },
  changeText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(16),
    color: colors.primary,
  },
  rightArrowIc: {
    tintColor: colors.primary,
    height: moderateScale(10),
    width: moderateScale(6),
    marginHorizontal: moderateScale(10),
  },
  addressTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(16),
    color: colors.black,
  },
  addressText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(15),
    color: '#747B81',
    marginVertical: moderateScale(8),
  },
  gstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  gstBtnTitle: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(16),
    color: colors.black,
    marginLeft: ms(10),
  },
  gstDetailsText: {
    marginLeft: ms(35),
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    color: colors.black,
    opacity: 0.6,
    lineHeight: ms(16),
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

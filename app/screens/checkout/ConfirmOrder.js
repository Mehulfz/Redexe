import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {moderateScale, ms} from 'react-native-size-matters';
import StepIndicator from 'react-native-step-indicator';
import {useDispatch, useSelector} from 'react-redux';
import app from '../../../app.json';
import {
  confirmOrder,
  confirmOrderPayment,
  getCheckoutDetails,
} from '../../actions';
import {Button} from '../../components/Buttons';
import Header from '../../components/Header';
import {OrderStatusDialog} from '../../components/Modals/OrderStatusDialog';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {CheckoutProducts} from './checkoutProducts';
import {DeliveryDetails} from './deliveryDetails';
import {Payment} from './payment';

export default function ConfirmOrder({route}) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(({user}) => user);
  const {myAddress} = useSelector(({user}) => user);
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState();

  const [shipping, setShipping] = useState(currentUser?.manage_address_data);
  const [billing, setBilling] = useState(currentUser?.manage_address_data);

  const [confirmLoader, showConfirmLoader] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const forceUpdate = React.useReducer(bool => !bool)[1];

  const [IsGSTInvoice, setIsGSTInvoice] = useState(false);

  const [statusDialog, setStatusDialog] = useState(false);
  const [orderStatus, setOrderStatus] = useState();

  const [data, setData] = useState();

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setIsLoading(true);
    const request = {};
    if (route?.params?.products) {
      request.products = JSON.stringify(route?.params?.products);
    }
    let res = await dispatch(getCheckoutDetails(request));
    setIsLoading(false);
    if (res?.status) {
      setData(res?.data);
      _handleDefaultAddress();
    }
  };

  const _handleDefaultAddress = async () => {
    myAddress?.map(x => {
      if (x?.is_default === 1) {
        setShipping(x);
        setBilling(x);
      }
    });
  };

  const _checkout = async (action = 'process', request = {}) => {
    if (step !== 2) {
      if (step === 0) {
        return setStep(step + 1);
      } else {
        setStep(step + 1);
        action = 'update'
      }
    }
    request = {
      ...request,
      payment_method: paymentType?.Key,
      shipping_address: shipping?.id,
      billing_address: billing?.id,
      process_checkout: action === 'update' ? false : true,
    };
    if (action === 'process' && data?.cart?.coupon?.code) {
      request.coupon_code = data?.cart?.coupon?.code;
    }
    if (request.process_checkout && IsGSTInvoice) {
      request.use_gst_invoice = true;
      request.gstin = data?.gst_detail?.gst_no;
      request.company_name = data?.gst_detail?.company_name;
    }
    showConfirmLoader(true);
    let {status, data: resData} = await dispatch(confirmOrder(request));
    if (!status) {
      if (action === 'update' && resData) {
        data.cart = resData;
        setData(data);
        forceUpdate();
      }
      return showConfirmLoader(false);
    }
    if (action === 'update') {
      data.cart = resData;
      setData(data);
      forceUpdate();
      showConfirmLoader(false);
    } else {
      if (resData?.key) {
        _razorPay(resData);
      } else {
        _orderSuccess(data?.payment_success);
      }
    }
  };

  const _razorPay = async data => {
    var options = {
      currency: data?.currency,
      key: data?.key,
      amount: data?.amount,
      name: app.displayName,
      image: app.logoLink,
      order_id: data?.id,
      prefill: {
        email: data?.user?.email,
        contact: data?.user?.phone,
        name: data?.user?.full_name,
      },
      theme: {color: colors.primary},
    };
    RazorpayCheckout.open(options)
      .then(async res => {
        console.log('RazorpayCheckout', res);
        let paymentStatus = await dispatch(
          confirmOrderPayment({
            razorpay_order_id: data?.id,
            razorpay_payment_id: res?.razorpay_payment_id,
          }),
        );
        showConfirmLoader(false);
        if (paymentStatus?.status) {
          _orderSuccess({status: true, payment_id: res?.razorpay_payment_id});
        } else {
          _orderSuccess({status: false, reason: paymentStatus.message});
        }
      })
      .catch(error => {
        // Alert.alert(`Error: ${error.code}`, error.description);
        showConfirmLoader(false);
        console.log('RazorpayCheckout Error: ', error);
        if (error.description) {
          if (isJson(error.description)) {
            const errorData = JSON.parse(error.description);
            _orderSuccess({
              status: false,
              reason: errorData?.error?.description,
              payment_id: errorData?.error?.metadata?.payment_id,
            });
          } else {
            _orderSuccess({
              status: false,
              reason: error.description,
              // payment_id: errorData?.error?.metadata?.payment_id,
            });
          }
        }
      });
  };

  const isJson = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const _orderSuccess = value => {
    showConfirmLoader(false);
    setOrderStatus(value);
    setStatusDialog(true);
    console.log(value);
  };

  const _change = (value, action) => {
    if (action === 'Billing') {
      setBilling(value);
    } else if (action === 'Delivery') {
      setShipping(value);
    } else if (action === 'gst') {
      data.gst_detail = value;
      setData(data);
      forceUpdate();
    }
  };

  const renderStepIndicator = () => {
    const labels = ['Products', 'Delivery Details', 'Payment'];

    const customStyles = {
      stepIndicatorSize: ms(30),
      currentStepIndicatorSize: ms(30),
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: colors.primary,
      stepStrokeWidth: 3,
      stepStrokeFinishedColor: colors.primary,
      stepStrokeUnFinishedColor: '#747B81',
      separatorFinishedColor: colors.primary,
      separatorUnFinishedColor: '#747B81',
      stepIndicatorFinishedColor: colors.primary,
      stepIndicatorLabelFontSize: ms(14),
      currentStepIndicatorLabelFontSize: ms(14),
      stepIndicatorLabelCurrentColor: colors.primary,
      stepIndicatorLabelUnFinishedColor: '#747B81',
      labelColor: '#747B81',
      labelSize: ms(14),
      currentStepLabelColor: colors.primary,
      stepIndicatorUnFinishedColor: colors.white,
      stepIndicatorCurrentColor: colors.white,
      stepIndicatorLabelFinishedColor: colors.white,
    };

    return (
      <View style={{marginVertical: ms(15)}}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={step}
          stepCount={3}
          labels={labels}
          onPress={position => {
            if (step > position && !confirmLoader) {
              setStep(position);
            }
          }}
        />
      </View>
    );
  };

  const renderFooter = () => {
    let disabled = confirmLoader;
    if (!confirmLoader) {
      if (step === 0) {
        disabled = false;
      } else if (step === 1) {
        if (
          (IsGSTInvoice && !data?.gst_detail?.gst_no) ||
          !shipping?.id ||
          !billing?.id
        ) {
          disabled = true;
        } else {
          disabled = false;
        }
      } else if (step === 2) {
        disabled = !paymentType;
      }
    }

    return (
      <View style={{marginVertical: ms(30), marginHorizontal: ms(50)}}>
        <Button
          title={step === 2 ? 'Checkout' : 'Next'}
          containerStyle={{
            height: ms(40),
            backgroundColor: disabled ? colors.darkGray : colors.primary,
          }}
          onPress={() => _checkout()}
          disabled={disabled}
          isLoading={confirmLoader}
        />
        <OrderStatusDialog
          isVisible={statusDialog}
          onClose={() => {
            setStatusDialog(false);
            setOrderStatus();
          }}
          data={orderStatus}
        />
      </View>
    );
  };

  const renderView = () => {
    if (step === 0) {
      return <CheckoutProducts products={data?.cart?.cart_items} />;
    } else if (step === 1) {
      return (
        <DeliveryDetails
          shipping={shipping}
          billing={billing}
          gstDetails={data?.gst_detail}
          onChange={_change}
          IsGSTInvoice={IsGSTInvoice}
          setIsGSTInvoice={setIsGSTInvoice}
        />
      );
    } else if (step === 2) {
      return (
        <Payment
          data={data}
          updateData={_checkout}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.root}>
      <Header isBack title="Checkout" center />
      {!IsLoading ? (
        <>
          {renderStepIndicator()}
          {renderView()}
          {renderFooter()}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  contentContainerStyle: {
    flexGrow: 1,
    padding: moderateScale(15),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
    marginBottom: moderateScale(15),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(14),
    color: colors.black,
    marginBottom: moderateScale(15),
  },
  couponContain: {
    borderWidth: moderateScale(1),
    borderColor: colors.lightGray,
    borderRadius: moderateScale(5),
    height: moderateScale(40),
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    paddingVertical: 0,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: colors.black,
    flex: 1,
    marginRight: moderateScale(15),
  },
  couponApplyText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(15),
    color: colors.blue,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: moderateScale(6),
  },
  summaryTitleText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(13),
    color: colors.black,
    flex: 1 / 2,
    opacity: 0.8,
  },
  summaryValueText: {
    fontFamily: env.fontRegular,
    fontSize: moderateScale(13),
    color: colors.black,
    flex: 1 / 2,
    opacity: 0.7,
  },
  totalText: {
    fontFamily: env.fontBold,
    fontSize: moderateScale(14),
    color: colors.black,
    flex: 1 / 2,
  },
  divider: {
    width: '100%',
    height: moderateScale(1),
    backgroundColor: colors.lightGray,
    marginVertical: moderateScale(8),
  },
  editText: {
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    color: colors.blue,
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
  radioText: {
    color: colors.black,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    borderWidth: moderateScale(1.5),
    borderColor: colors.primary,
    borderRadius: moderateScale(18),
    width: moderateScale(18),
    height: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFillCircle: {
    backgroundColor: colors.primary,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(15),
  },
  btn: {
    backgroundColor: colors.primary,
    height: moderateScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(5),
  },
  btnText: {
    color: colors.white,
    fontFamily: env.fontSemibold,
    fontSize: moderateScale(14),
  },
  invalidText: {
    color: colors.red,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(10),
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  footerErrorMsgText: {
    color: colors.red,
    fontFamily: env.fontRegular,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  radioText: {
    color: colors.black,
    fontFamily: env.fontMedium,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },

  radioCircle: {
    borderWidth: moderateScale(1.5),
    borderColor: colors.primary,
    borderRadius: moderateScale(18),
    width: moderateScale(18),
    height: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFillCircle: {
    backgroundColor: colors.primary,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(15),
  },
});

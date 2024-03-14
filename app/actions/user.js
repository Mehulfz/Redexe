import Api from '../utils/Api';
import AsyncStorage from '@react-native-community/async-storage';
import {flashMessage, rootLoader} from '.';
import {
  navigate,
  navigationRef,
  navigationReset,
} from '../navigation/RootNavigation';
import _ from 'lodash';
import {LOGIN_OTP_TYPE, REGISTER_OTP_TYPE} from '../constants';

export function updateUserState(key, value) {
  return dispatch => {
    dispatch({type: 'UPDATE_USER_REDUCER', payload: {[key]: value}});
  };
}

export function setLoginUser(data) {
  return dispatch => {
    dispatch({
      type: 'USER_LOGIN',
      payload: data,
    });
    Api.defaultHeader({
      Authorization: 'Bearer ' + data.access_token,
    });
    dispatch(getProfile());
  };
}

export function userLogin(params) {
  return async dispatch => {
    try {
      const {status, data} = await Api.POST('v2/login', params);
      if (status === 200 && data.success) {
        dispatch(setLoginUser(data.data));
        AsyncStorage.setItem('@auth', JSON.stringify(data.data));
        return {status: true, data: data.data};
      }
      console.log('login-failed: ', data);
      if (data.data.mobile_flag == 1 && !data.data.user_active) {
        navigate('accountVerification', {data: data.data});
      }
      flashMessage(
        'Warning!',
        data.message || 'Opps! Something is wrong',
        'warning',
      );
      return {
        status: false,
        unverifiedEmail: !data.data.user_active && data.data.email_flag == 1,
      };
    } catch (error) {
      console.log(error);
      flashMessage('Warning!', 'Opps! Something is wrong', 'warning');
      return {status: false};
    }
  };
}

export function userRegister(params) {
  return async dispatch => {
    try {
      const {status, data} = await Api.POST('v3/register', params);
      if (status === 200 && data.success) {
        dispatch(setLoginUser(data.data));
        AsyncStorage.setItem('@auth', JSON.stringify(data.data));
        return {status: true, data: data.data};
      }
      console.log('register-failed: ', data);
      flashMessage(
        'Error!',
        data.message || 'Opps! Something is wrong',
        'danger',
      );
      return {status: false, message: data.message};
    } catch (error) {
      console.log(error);
      flashMessage('Error!', 'Opps! Something is wrong', 'danger');
      return {status: false};
    }
  };
}

export const sendOTPForAccount = params => {
  return async () => {
    const {status, data} = await Api.POST('v3/send-otp', params);
    if (status === 200 && data.success) {
      return {status: true, data: data?.data};
    }
    return {status: false, message: data?.message};
  };
};

export function userLogout() {
  return async dispatch => {
    Api.POST('v1/logout');
    dispatch({type: 'USER_LOGOUT'});
    await AsyncStorage.clear();
    return true;
  };
}

export async function forgotPasswordByEmail(params) {
  try {
    const {status, data} = await Api.POST('v1/forgot-password', params);
    if (status === 200 && data.success) {
      flashMessage(
        'Success',
        data.message || 'We have emailed your password reset link!',
        'success',
      );
      return {status: true};
    }
    console.log('forgot-password-failed: ', data);
    flashMessage(
      'Error!',
      data.message || 'Opps! Something is wrong',
      'danger',
    );
    return {status: false};
  } catch (error) {
    console.log(error);
    flashMessage('Error!', 'Opps! Something is wrong', 'danger');
    return {status: false};
  }
}

export function sendMobileOtp(params) {
  return async dispatch => {
    try {
      dispatch(rootLoader(true));
      const {status, data} = await Api.POST('v1/resend-otp', params);
      dispatch(rootLoader(false));
      if (status === 200 && data.success) {
        flashMessage('Sent OTP', data.message, 'success');
        return status === 200 && data.success;
      }
      flashMessage(
        'Error!',
        data.message || 'Opps! Something is wrong',
        'danger',
      );
      return false;
    } catch (error) {
      console.log(error);
      flashMessage('Error!', 'Opps! Something is wrong', 'danger');
      return true;
    }
  };
}

export function otpVerify(params) {
  return async dispatch => {
    try {
      dispatch(rootLoader(true));
      const {status, data} = await Api.POST('v3/verify-otp', params);
      dispatch(rootLoader(false));

      if (status === 200 && data.success) {
        if (
          params?.type === LOGIN_OTP_TYPE ||
          params?.type === REGISTER_OTP_TYPE
        ) {
          dispatch(setLoginUser(data.data));
          AsyncStorage.setItem('@auth', JSON.stringify(data.data));
          navigationReset('dashboard');
        }
        return true;
      }
      flashMessage(
        'Warning!',
        data.message || 'Opps! Something is wrong',
        'warning',
      );
      return false;
    } catch (error) {
      console.log(error);
      flashMessage('Error!', 'Opps! Something is wrong', 'danger');
      return true;
    }
  };
}

export async function sendEmailVerification(params) {
  try {
    const {status, data} = await Api.POST(
      'v1/resend-email-verification',
      params,
    );
    if (status === 200 && data.success) {
      flashMessage(
        'Success',
        data.message || 'We have verification email!',
        'success',
      );
      return status === 200 && data.success;
    }
    console.log('email-verification-failed: ', data);
    flashMessage(
      'Error!',
      data.message || 'Opps! Something is wrong',
      'danger',
    );
    return false;
  } catch (error) {
    console.log(error);
    flashMessage('Error!', 'Opps! Something is wrong', 'danger');
    return false;
  }
}

export function changeAccountPassword(params) {
  return async dispatch => {
    try {
      dispatch(rootLoader(true));
      const {status, data} = await Api.POST(
        'v1/account/profile/change-password',
        params,
      );
      dispatch(rootLoader(false));
      if (status === 200 && data.success) {
        flashMessage(
          'Success',
          data.message || 'Password update successfully!',
          'success',
        );
        navigationRef.current.goBack();
        return status === 200 && data.success;
      }
      console.log('change-password-failed: ', data);
      flashMessage(
        'Error!',
        data.message || 'Opps! Something is wrong',
        'danger',
      );
      return false;
    } catch (error) {
      console.log(error);
      flashMessage('Error!', 'Opps! Something is wrong', 'danger');
      return false;
    }
  };
}

export function getAddress(params = {}) {
  return async (dispatch, getState) => {
    try {
      const {myAddress} = getState().user;
      if (!params.page) params.page = 1;
      params.limit = 20;
      const {data} = await Api.GET('v1/account/manage-addresses/list', params);
      if (data.success) {
        let list = [];
        if (!params.page || params.page == 1) list = data?.data?.data;
        else {
          list = [...myAddress, ...data?.data?.data];
          list = _.uniqBy(list, 'id');
        }
        dispatch(updateUserState('myAddress', list));
        return data?.data?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function addAddress(params) {
  return async dispatch => {
    dispatch(rootLoader(true));
    let endpoint = 'v1/account/manage-addresses/save';
    const {data} = await Api.POST(endpoint, params);
    dispatch(rootLoader(false));
    if (data.success) {
      dispatch(getAddress());
      // navigationRef.current.goBack();
    } else {
      flashMessage(data.message, '', data.success ? 'success' : 'danger');
    }
    return {status: data.success, data: data.data};
  };
}

export function deleteAddress(id) {
  return async dispatch => {
    const {data} = await Api.POST('v1/account/manage-addresses/delete', {
      manage_address_id: id,
    });
    if (data.success) {
      dispatch(getAddress());
      return;
    }
  };
}

export function setDefaultAddress(id) {
  return async dispatch => {
    const {data} = await Api.POST('v1/account/manage-addresses/setdefault', {
      manage_address_id: id,
    });
    if (data.success) {
      dispatch(getAddress());
      return;
    }
  };
}

export function getProfile() {
  return async (dispatch, getState) => {
    const {currentUser} = getState().user;
    const {data} = await Api.GET('v1/account/profile');
    if (data.success) {
      dispatch(updateUserState('currentUser', {...currentUser, ...data.data}));
      return;
    }
  };
}

export function updateProfile(params) {
  return async dispatch => {
    dispatch(rootLoader(true));
    const {data} = await Api.POST('v1/account/profile/update', params);
    dispatch(rootLoader(false));
    flashMessage(data.message, '', data.success ? 'success' : 'danger');
    if (data.success) {
      dispatch(getProfile());
      navigationRef.current.goBack();
      return;
    }
  };
}

export function updateProfilePicture(params) {
  return async dispatch => {
    dispatch(rootLoader(true));
    const {data} = await Api.POST('v1/account/profile/image', params);
    dispatch(rootLoader(false));
    flashMessage(data.message, '', data.success ? 'success' : 'danger');
    if (data.success) {
      dispatch(getProfile());
      return;
    }
  };
}

export function getRefundBankPayments(params = {}) {
  return async (dispatch, getState) => {
    try {
      const {refundBankPayments} = getState().user;
      if (!params.page) params.page = 1;
      params.limit = 20;
      const {data} = await Api.GET('v1/account/refund-payment/list', params);
      if (data.success) {
        let list = [];
        if (!params.page || params.page == 1) list = data?.data?.data;
        else {
          list = [...refundBankPayments, ...data?.data?.data];
          list = _.uniqBy(list, 'id');
        }
        dispatch(updateUserState('refundBankPayments', list));
        return data?.data?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getRefundUPIPayments(params = {}) {
  return async (dispatch, getState) => {
    try {
      const {refundUPIPayments} = getState().user;
      if (!params.page) params.page = 1;
      params.limit = 20;
      const {data} = await Api.GET(
        'v1/account/refund-payment/upi/list',
        params,
      );
      if (data.success) {
        let list = [];
        if (!params.page || params.page == 1) list = data?.data?.data;
        else {
          list = [...refundUPIPayments, ...data?.data?.data];
          list = _.uniqBy(list, 'id');
        }
        dispatch(updateUserState('refundUPIPayments', list));
        return data?.data?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function addUIPDetails(params) {
  return async dispatch => {
    dispatch(rootLoader(true));
    const {data} = await Api.POST(
      'v1/account/refund-payment/upidetailsave',
      params,
    );
    dispatch(rootLoader(false));
    flashMessage(data.message, '', data.success ? 'success' : 'danger');
    if (data.success) {
      dispatch(getRefundUPIPayments());
      navigationRef.current.goBack();
      return;
    }
  };
}

export function addBankDetails(params) {
  return async dispatch => {
    dispatch(rootLoader(true));
    const {data} = await Api.POST(
      'v1/account/refund-payment/bankdetailsave',
      params,
    );
    dispatch(rootLoader(false));
    flashMessage(data.message, '', data.success ? 'success' : 'danger');
    if (data.success) {
      dispatch(getRefundBankPayments());
      navigationRef.current.goBack();
      return;
    }
  };
}

export function setDefaultRefundPayment(id) {
  return async dispatch => {
    const {data} = await Api.POST('v1/account/refund-payment/setdefault', {
      refund_payment_id: id,
    });
    if (data.success) {
      dispatch(getRefundBankPayments());
      return;
    }
  };
}

export function deleteRefundPayment(id) {
  return async dispatch => {
    const {data} = await Api.POST('v1/account/refund-payment/delete', {
      refund_payment_id: id,
    });
    if (data.success) {
      // dispatch(getRefundBankPayments());
      return;
    }
  };
}

export async function getSellerFeedback(params = {}) {
  try {
    params.limit = 20;
    const {data} = await Api.GET('v1/account/feedback', params);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function submitFeedback(params = {}) {
  try {
    const {data} = await Api.POSTFORMDATA('v1/account/feedback/save', params);
    flashMessage(data.message, '', data.success ? 'success' : 'danger');
    return data.success;
  } catch (error) {
    console.log(error);
  }
}

export async function likeUnlikeFeedback(params = {}) {
  try {
    const {data} = await Api.POST('v1/account/likeUnlike/save', params);
    return data.success;
  } catch (error) {
    console.log(error);
  }
}

export async function getGSTInfo() {
  try {
    const {data} = await Api.GET('v1/account/gst-number');
    if (data.success) {
      return data.data;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function submitGSTInfo(params) {
  try {
    const {data} = await Api.POST('v1/account/gst-number/save', params);
    flashMessage(
      data.success ? 'Success' : 'Error!',
      data.message,
      data.success ? 'success' : 'danger',
    );
    return data.success;
  } catch (error) {
    console.log(error);
    return false;
  }
}

import {Alert} from 'react-native';
import {flashMessage} from '.';
import Api from '../utils/Api';

export function updateOrderState(key, value) {
  return dispatch => {
    dispatch({type: 'UPDATE_ORDER_REDUCER', payload: {[key]: value}});
  };
}

export function confirmOrder(params) {
  return async () => {
    try {
      const {data} = await Api.POST('v3/process-checkout', params);
      if (data?.success) {
        return {status: true, data: data.data};
      }
      Alert.alert('', data.message || 'Something is wrong!');
      return {status: false, data: data.data};
    } catch (error) {
      console.log('confirmOrder:- ', error);
      return {status: false};
    }
  };
}

export function confirmOrderPayment(params) {
  return async () => {
    try {
      const {data} = await Api.POST('v1/confirm-payment', params);
      if (data?.success) {
        return {status: true, data: data?.data};
      }
      // Alert.alert('', data.message || 'Something is wrong!');
      return {status: false, message: data.message};
    } catch (error) {
      console.log('confirmOrderPayment:- ', error);
      return {status: false};
    }
  };
}

export async function getMyOrders(params) {
  try {
    const {data} = await Api.GET('v1/account/order-list', params);
    if (data?.success) return data?.data?.data;
    return;
  } catch (error) {
    console.log('getMyOrders:- ', error);
  }
}

export function cancelOrderProduct(params) {
  return async (dispatch, getState) => {
    try {
      const {data} = await Api.GET('v1/account/order-cancel', params);
      flashMessage(
        data.message || 'Something is wrong!',
        '',
        data?.response_code,
      );
      if (data?.success) {
        dispatch(getOrderDetails());
        return {status: true, data: data.data};
      }
      return {status: false, message: data.message || 'Something is wrong!'};
    } catch (error) {
      console.log('cancelOrderProduct:- ', error);
    }
  };
}

export function extendOrderProcessingTime(params) {
  return async (dispatch, getState) => {
    try {
      const {data} = await Api.GET('v1/account/extend-processing-days', params);
      flashMessage(
        data.message || 'Something is wrong!',
        '',
        data?.response_code,
      );
      if (data?.success) {
        dispatch(getOrderDetails());
        return {status: true, data: data.data};
      }
      return {status: false, message: data.message || 'Something is wrong!'};
    } catch (error) {
      console.log('cancelOrderProduct:- ', error);
    }
  };
}

export function getOrderTracking(params) {
  return async dispatch => {
    try {
      const {data} = await Api.GET('v1/account/track-order', params);
      if (data?.success) {
        dispatch(updateOrderState('trackingDetails', data.data));
        return {status: true, data: data.data};
      }
      Alert.alert('', data.message || 'Something is wrong!');
      return {status: false, message: data.message || 'Something is wrong!'};
    } catch (error) {
      console.log('cancelOrderProduct:- ', error);
      return {status: false, message: 'Something is wrong!'};
    }
  };
}

export async function orderCompleted(params) {
  try {
    const {data} = await Api.GET('v1/account/order-complete', params);
    if (!data?.success) {
      flashMessage('Error!', data.message || 'Something is wrong!', 'error');
    } else {
      flashMessage('Thanks!', data.message, 'success');
    }
    return data?.success;
  } catch (error) {
    console.log('orderCompleted:- ', error);
  }
}

export function disputeRequest(params) {
  return async dispatch => {
    try {
      try {
        const {data} = await Api.POST('v1/account/dispute', params);
        if (!data?.success) {
          flashMessage(
            'Error!',
            data.message || 'Something is wrong!',
            'error',
          );
        } else {
          dispatch(getOrderDetails());
          flashMessage(data.message, '', 'success');
        }
        return data?.success;
      } catch (error) {
        console.log('disputeRequest:- ', error);
      }
    } catch (error) {
      console.log('getOrderDetails:- ', error);
    }
  };
}

export function getOrderDetails() {
  return async (dispatch, getState) => {
    try {
      const {orderDetails} = getState().order;
      const {data} = await Api.GET('v1/account/order-detail', {
        order_id: orderDetails?.order_id,
      });
      if (data?.success) dispatch(updateOrderState('orderDetails', data?.data));
      return data;
    } catch (error) {
      console.log('getOrderDetails:- ', error);
    }
  };
}

export async function getDisputeDetails(dispute_request_no) {
  try {
    const {data} = await Api.GET('v1/account/dispute', {dispute_request_no});
    if (data?.success) return data?.data;
  } catch (error) {
    console.log('getDisputeDetails:- ', error);
  }
}

export async function getDisputeDiscussion(params) {
  try {
    const {data} = await Api.GET('v1/account/dispute/discussion', params);
    if (!data?.success) return;
    const responseList = data.data?.data || [];
    let list = responseList?.map(item => {
      let message = {
        _id: item.id,
        createdAt: item.created_at,
        text: item.message,
        image: item.image,
        user: {
          _id: item.sender_id,
        },
      };
      return message;
    });
    return list;
  } catch (error) {
    console.log('getDisputeDiscussion:- ', error);
  }
}

export async function sendDisputeDiscussion(params) {
  try {
    const {data} = await Api.POST('v1/account/dispute/reply', params);
    if (data?.success) return data?.data;
  } catch (error) {
    console.log('sendDisputeDiscussion:- ', error);
  }
}

export async function updateDisputeStatus(params) {
  try {
    const {data} = await Api.POST('v1/account/dispute/update', params);
    return {status: data?.success, message: data?.message};
  } catch (error) {
    console.log('updateDisputeStatus:- ', error);
  }
}

import Api from '../utils/Api';

export function updateMetaState(key, value) {
  return (dispatch) => {
    dispatch({type: 'UPDATE_META_REDUCER', payload: {[key]: value}});
  };
}

export function getCategoryList() {
  return async (dispatch) => {
    try {
      const {status, data} = await Api.GET('v1/categories');
      if (status === 200 && data.success) {
        dispatch({type: 'GET_CATEGORY_LIST', payload: data.data});
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getSubCategoryList(params) {
  return async () => {
    try {
      const {status, data} = await Api.GET('v1/categories', params);
      if (status === 200 && data.success) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getStateList() {
  return async (dispatch) => {
    try {
      const {status, data} = await Api.GET('v1/state');
      if (status === 200 && data.success) {
        dispatch(updateMetaState('stateList', data.data));
        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export async function getPromotionCoupons(params) {
  try {
    const {status, data} = await Api.GET(
      'v1/account/promotion-coupons',
      params,
    );
    if (status === 200 && data.success) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export function getCancelReason() {
  return async (dispatch) => {
    try {
      const {status, data} = await Api.GET('v1/account/order-cancel-reason');
      if (status === 200 && data.success) {
        let list = data.data?.map((x) => {
          return {name: x};
        });
        dispatch(updateMetaState('cancelReasonList', list));
        return list;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export async function getCheckoutCoupons(params) {
  try {
    const {status, data} = await Api.GET('v3/coupon_list', params);
    if (status === 200 && data.success) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
}

import {flashMessage} from '.';
import Api from '../utils/Api';

export function updateProductState(key, value) {
  return (dispatch) => {
    dispatch({type: 'UPDATE_PRODUCT_REDUCER', payload: {[key]: value}});
  };
}

export function getProductsList(params = {}) {
  return async (dispatch, getState) => {
    try {
      const {filterObj} = getState().product;
      params = {...params, ...filterObj};
      const {data} = await Api.GET('v1/product-list', params);
      if (data.success) {
        const resData = data?.data,
          apiFilterList = {};
        if (resData?.size_list && resData?.size_list?.length)
          apiFilterList.size_list = resData?.size_list;
        if (resData?.color_list) apiFilterList.color_list = resData?.color_list;
        if (resData?.order_by) apiFilterList.order_by = resData?.order_by;
        if (resData?.min_price) apiFilterList.min_price = resData?.min_price;
        if (resData?.max_price) apiFilterList.max_price = resData?.max_price;
        dispatch(updateProductState('apiFilterList', apiFilterList));
        return resData;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getProduct(Id) {
  return async (dispatch, getState) => {
    try {
      const {productDetails} = getState().product;
      const {status, data} = await Api.GET('v2/product', {
        product_id: Id || productDetails.product_id,
      });
      if (status === 200 && data.success) {
        dispatch(updateProductState('productDetails', data.data));
      }
      return {status: data.success, data: data?.data};
    } catch (error) {
      console.log(error);
    }
  };
}

export function getProductUpdatedState(params) {
  return async (dispatch, getState) => {
    try {
      const {productDetails} = getState().product;
      params.product_id = productDetails.product_id;
      const {data} = await Api.GET('v2/get-product-price', params);
      if (data.success) {
        let newData = data.data;
        var tmpProduct = {...productDetails, ...newData};
        // if (newData?.bulk_price)
        //   tmpProduct.bulk_price = newData?.bulk_price;
        dispatch(updateProductState('productDetails', tmpProduct));
        return {status: true, data: newData};
      } else {
        return {status: false, message: data.message, code: data.response_code};
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export async function getProductFeedback(params) {
  try {
    const {data} = await Api.GET('v1/get-product-feedback', params);
    if (data.success) {
      return data.data?.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getProductFAQ(params) {
  try {
    const {data} = await Api.GET('v1/get-product-faq', params);
    if (data.success) {
      return data.data?.data;
    }
  } catch (error) {
    console.log(error);
  }
}

// USER CART ACTIONS

export function getCartProducts() {
  return async (dispatch) => {
    const {data} = await Api.GET('v3/cart');
    if (data.success) {
      dispatch(updateProductState('cartProducts', data.data));
    }
  };
}

export function productUpdateCart(params) {
  return async (dispatch) => {
    const {data} = await Api.POST('v3/cart/update', params);
    if (data.success) {
      // if (params.actionType === 'update-cart') {
      //   dispatch(getCartProducts());
      // } else if (params.actionType === 'update-selection-item') {
      //   dispatch(updateProductState('cartProducts', data.data));
      // }
      dispatch(updateProductState('cartProducts', data.data));
    }
    return data.success;
  };
}

export function productAddToCart(params) {
  return async (dispatch) => {
    const {data} = await Api.POST('v3/cart/add', params);
    if (!params?.type) flashMessage(data.message, '', data.response_code);
    if (data.success) dispatch(getCartProducts());
    return {status: data.success, data: data.data};
  };
}

export function productRemoveFromCart(id) {
  return async (dispatch) => {
    const {data} = await Api.DELETE('v2/cart', {id});
    flashMessage(data.message, '', data.response_code);
    if (data.success) dispatch(getCartProducts());
  };
}

export function getCheckoutDetails(params) {
  return async () => {
    const {data} = await Api.GET('v3/checkout', params);
    return {status: data.success, data: data.data};
  };
}

export function saveProductFAQ(params) {
  return async (dispatch) => {
    const {data} = await Api.POST('v1/product/faq-save', params);
    flashMessage(data.message, '', data.response_code);
    return {status: data.success};
  };
}

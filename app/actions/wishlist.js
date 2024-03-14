import {flashMessage, updateProductState} from '.';
import Api from '../utils/Api';

export function getWishlistProducts(params = {}) {
  return async (dispatch, getState) => {
    const {selectedWishlistCategory, selectedMainCategory} = getState().product;
    if (selectedWishlistCategory)
      params.private_cat_id = selectedWishlistCategory?.id;
    if (selectedMainCategory) params.main_cat_id = selectedMainCategory?.CatID;
    const {data} = await Api.GET('v1/account/wishlist', params);
    if (data.success) {
      dispatch(updateProductState('wishlistProducts', data?.data?.data));
    }
  };
}

export function productAddRemoveToWishlist(params) {
  return async (dispatch) => {
    const {data} = await Api.POST('v1/account/wishlist/save', params);
    flashMessage(data.message, '', data.response_code);
    if (data.success) dispatch(getWishlistProducts());
    return data.success
  };
}

export function getWishlistMainCategory() {
  return async (dispatch) => {
    const {data} = await Api.GET('v1/main-category');
    if (data.success) {
      let list = [{id: 'all', name: 'All Categories'}];
      data?.data?.map((item) => {
        item.name = item.CatTitle;
        list.push(item);
      });
      dispatch(updateProductState('mainCategories', list));
    }
  };
}

export function getWishlistCategory() {
  return async (dispatch) => {
    const {data} = await Api.GET('v1/account/wishlist/user-category/list');
    if (data.success) {
      let list = [{id: 'all', name: 'All Categories'}];
      data?.data?.map((item) => {
        item.name = item.wishlist_category;
        list.push(item);
      });
      dispatch(updateProductState('wishlistCategories', list));
    }
  };
}

export function createWishlist(params) {
  return async (dispatch) => {
    const {data} = await Api.POST(
      'v1/account/wishlist/user-category/save',
      params,
    );
    flashMessage(data.message, '', data.response_code);
    if (data.success) {
      dispatch(getWishlistCategory());
      return true;
    } else {
      return false;
    }
  };
}

export function removeWishlistCategory() {
  return async (dispatch, getState) => {
    const {selectedWishlistCategory} = getState().product;
    const {data} = await Api.DELETE(
      'v1/account/wishlist/category?private_cat_id=' +
        selectedWishlistCategory.id,
    );
    if (data.success) {
      dispatch(updateProductState('selectedWishlistCategory', null));
      dispatch(getWishlistCategory());
      dispatch(getWishlistProducts());
      return true;
    } else {
      flashMessage('Error!', data.message, 'danger');
    }
  };
}

export function addToPrivateCategory(params) {
  return async () => {
    const {data} = await Api.POST(
      'v1/account/wishlist/user-category/update',
      params,
    );
    flashMessage(data.message, '', data.success ? 'success' : 'danger');
  };
}

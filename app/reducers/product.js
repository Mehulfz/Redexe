const initialState = {
  productDetails: {},
  cartProducts: {},
  wishlistProducts: [],
  wishlistCategories: [],
  mainCategories: [],
  selectedWishlistCategory: null,
  selectedMainCategory: null,
  showFilterModal: false,
  filterObj: {},
  apiFilterList: {},
};
const product = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCT_REDUCER':
      return {...state, ...action.payload};

    case 'USER_LOGOUT':
      return initialState;

    default:
      break;
  }
  return state;
};
export default product;

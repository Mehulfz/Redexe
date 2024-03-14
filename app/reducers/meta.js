const initialState = {
  stateList: [],
  categories: [],
  cancelReasonList: [],
};
const meta = (state = initialState, action) => {
  switch (action.type) {
    case 'STATE_LIST':
      return {stateList: action.payload};
    case 'GET_CATEGORY_LIST':
      return {categories: action.payload};

    case 'UPDATE_META_REDUCER':
      return {...state, ...action.payload};

    case 'USER_LOGOUT':
      return initialState;

    default:
      return state;
  }
};
export default meta;

const initialState = {
  orderDetails: {},
  orderActionProduct: {},
  showCancelOrderModal: false,
  showExtendProcessingModal: false,
  showTrackingOrderModal: false,
  trackingDetails: [],
  showRequestForReturnReplaceModal: false,
  showCancelDisputeModal: false,
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_ORDER_REDUCER':
      return {...state, ...action.payload};

    case 'USER_LOGOUT':
      return initialState;

    default:
      break;
  }
  return state;
};
export default order;

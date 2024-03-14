const initialState = {
  userNotificationToken: '',
  currentUser: null,
  myAddress: [],
  refundBankPayments: [],
  refundUPIPayments: []
};

export default function user(state = initialState, arg) {
  switch (arg.type) {
    case 'USER_LOGIN':
      return {...state, currentUser: arg.payload};

    case 'UPDATE_USER_REDUCER':
      return {...state, ...arg.payload};

    case 'USER_LOGOUT':
      return initialState;

    default:
      break;
  }
  return state;
}

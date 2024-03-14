  // src/store/reducers.js
const mehul = {
    counter: 0,
  };
  
  const rootReducer = (state = mehul, action) => {
    switch (action.type) {
      case 'INCREMENT':
        console.log('reducer increment')
        return { ...state, counter: state.counter + 10 };
      case 'DECREMENT':
        console.log('reducer decrement')
        return { ...state, counter: state.counter - 1 };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  
const initialState = {
  rootLoader: false,
  rootLoaderTitle: '',
};
const activityIndicator = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_ACTIVITY_INDICATOR_ROOT':
      return {rootLoader: true, rootLoaderTitle: action.text};
    case 'HIDE_ACTIVITY_INDICATOR_ROOT':
      return {rootLoader: false, rootLoaderTitle: ''};
    default:
      return state;
  }
};
export default activityIndicator;

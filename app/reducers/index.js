import { combineReducers } from 'redux'
import user from './user'
import activityIndicator from './activityIndicator'
import meta from './meta'
import product from './product'
import order from './order'

const rootReducer = combineReducers({
  user,
  activityIndicator,
  meta,
  product,
  order
})

export default rootReducer

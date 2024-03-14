import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'

function configureStore (preloadedState) {
  const middlewares = [thunk]
  const middlewaresEnhancer = composeWithDevTools(applyMiddleware(...middlewares))

  const storeEnhancer = [middlewaresEnhancer]
  const composedEnhancer = compose(...storeEnhancer)

  const store = createStore(
    rootReducer,
    preloadedState,
    composedEnhancer
  )
  return store
}

export default configureStore

import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ProvidersReducer from '../Reducers/reducers';

const rootReducer = combineReducers({
  ProvidersReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
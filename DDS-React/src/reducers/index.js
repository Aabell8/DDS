import { combineReducers } from 'redux';
import dataReducer from './dataReducer';

/**
 * exports all redux reducers for store
 */
export default combineReducers({
  data: dataReducer
});

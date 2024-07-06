import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import AppReducer from './app';
import { Store } from './app/typeReducers';

const createReducer = () => {
  return combineReducers({
    [Store.APP_REDUCER]: AppReducer,
    form: formReducer,
  });
};

export default createReducer;

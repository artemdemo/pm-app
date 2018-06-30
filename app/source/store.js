import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import _isFunction from 'lodash/isFunction';

import errorHandler from './middleware/errorHandler';
import successHandler from './middleware/successHandler';

import combineReducers from './reducers';
import sagas from './sagas';

// There is breaking change in webpack 4
// It's related to CommonJs modules (which is `redux-saga`)
// Fot this modules webpack is adding additional `default`
// @link https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655
const sagaMiddleware = _isFunction(createSagaMiddleware) ? createSagaMiddleware() : createSagaMiddleware.default();

const store = createStore(combineReducers, applyMiddleware(sagaMiddleware, errorHandler, successHandler));
sagaMiddleware.run(sagas);

export default store;

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import errorHandler from './middleware/errorHandler';
import successHandler from './middleware/successHandler';

import combineReducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(combineReducers, applyMiddleware(sagaMiddleware, errorHandler, successHandler));
sagaMiddleware.run(sagas);

export default store;

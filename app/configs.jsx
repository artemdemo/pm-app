import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {createStore, combineReducers} from 'redux';
import {browserHistory} from 'react-router';

import tasks from './reducers/tasks';
import user from './reducers/user';

const pmApp = combineReducers({
    tasks,
    user,
    routing: routerReducer
});

export const store = createStore(pmApp);

export const history = syncHistoryWithStore(browserHistory, store);

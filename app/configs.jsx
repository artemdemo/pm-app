import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import tasks from './reducers/tasks';
import boards from './reducers/boards';
import projects from './reducers/projects';
import user from './reducers/user';
import notification from './reducers/notification';
import selectedEntity from './reducers/selectedEntity';

const pmApp = combineReducers({
    user,
    tasks,
    boards,
    projects,
    notification,
    selectedEntity,
    routing: routerReducer
});

export const store = createStore(pmApp, applyMiddleware(thunk));

export const history = syncHistoryWithStore(browserHistory, store);

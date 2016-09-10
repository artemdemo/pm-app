import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import tasks from './reducers/tasks';
import boards from './reducers/boards';
import projects from './reducers/projects';
import settings from './reducers/settings';
import user from './reducers/user';
import popup from './reducers/popup';
import modal from './reducers/modal';
import notification from './reducers/notification';
import selectedEntity from './reducers/selectedEntity';

const pmApp = combineReducers({
    user,
    tasks,
    popup,
    modal,
    boards,
    projects,
    settings,
    notification,
    selectedEntity,
    routing: routerReducer,
});

export const store = createStore(pmApp, applyMiddleware(thunk));

export const history = syncHistoryWithStore(browserHistory, store);

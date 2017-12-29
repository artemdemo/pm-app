import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import tasks from './model/reducers/tasks';
import boards from './model/reducers/boards';
import projects from './model/reducers/projects';
import settings from './model/reducers/settings';
import user from './model/reducers/user';
import popup from './model/reducers/popup';
import modal from './model/reducers/modal';
import notification from './model/reducers/notification';
import selectedEntity from './model/reducers/selectedEntity';

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

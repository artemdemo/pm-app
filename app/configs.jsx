import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import tasks from './model/tasks/tasksReducer';
import boards from './model/boards/boardsReducer';
import projects from './model/projects/projectsReducer';
import settings from './model/settings/settingsReducer';
import user from './model/user/userReducer';
import popup from './model/popup/popupReducer';
import modal from './model/modal/modalReducer';
import notification from './model/notification/notificationReducer';
import selectedEntity from './model/selectedEntity/selectedEntityReducer';

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

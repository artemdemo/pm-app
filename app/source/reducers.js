import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './model/auth/authReducer';
import boards from './model/boards/boardsReducer';
import projects from './model/projects/projectsReducer';
import settings from './model/settings/settingsReducer';
import tasks from './model/tasks/tasksReducer';

const reducers = combineReducers({
    auth,
    boards,
    projects,
    settings,
    tasks,

    routing: routerReducer,
});

export default reducers;

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './model/auth/authReducer';
import boards from './model/boards/boardsReducer';
import modal from './model/modal/modalReducer';
import projects from './model/projects/projectsReducer';
import selectedEntity from './model/selectedEntity/selectedEntityReducer';
import settings from './model/settings/settingsReducer';
import tasks from './model/tasks/tasksReducer';

const reducers = combineReducers({
    auth,
    boards,
    modal,
    projects,
    selectedEntity,
    settings,
    tasks,

    routing: routerReducer,
});

export default reducers;

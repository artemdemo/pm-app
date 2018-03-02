import { combineReducers } from 'redux';

import tasks from './model/tasks/tasksReducer';
import boards from './model/boards/boardsReducer';
import projects from './model/projects/projectsReducer';
import settings from './model/settings/settingsReducer';
import user from './model/user/userReducer';
import modal from './model/modal/modalReducer';
import notification from './model/notification/notificationReducer';
import selectedEntity from './model/selectedEntity/selectedEntityReducer';

const reducers = combineReducers({
    user,
    tasks,
    modal,
    boards,
    projects,
    settings,
    notification,
    selectedEntity,
});

export default reducers;

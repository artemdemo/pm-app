import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import store from './store';

import './styles/general.less';

import AppView from './views/AppView';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import TasksView from './views/TasksView';
import ScrumView from './views/ScrumView';
import ProjectsView from './views/ProjectsView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import MainView from './views/MainView';

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={AppView}>
                <IndexRoute component={MainView} />
                <Route path='login' component={LoginView} />
                <Route path='signup' component={SignupView} />
                <Route path='profile' component={ProfileView} />
                <Route path='settings' component={SettingsView} />
                <Route path='tasks' component={TasksView} />
                <Route path='scrum' component={ScrumView} />
                <Route path='projects' component={ProjectsView} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('pm-app')
);

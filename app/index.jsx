import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createHistory } from 'history';
import promises from 'es6-promise';

import './styles/general.less';

import { store, history } from './configs';

import AppView from './views/AppView';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import TasksView from './views/TasksView';
import { ProjectsView } from './views/ProjectsView';
import { MainView } from './views/MainView';
import { requireAuthentication } from './components/AuthenticatedComponent';

promises.polyfill();

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={AppView}>
                <IndexRoute component={MainView} />
                <Route path='login' component={LoginView} />
                <Route path='signup' component={SignupView} />
                <Route path='tasks' component={TasksView} />
                <Route path='projects' component={ProjectsView} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('pm-app')
);

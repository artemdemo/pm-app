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
import TasksView from './views/TasksView';
import { MainView } from './views/MainView';
import { SignupView } from './views/SignupView';
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
            </Route>
        </Router>
    </Provider>,
    document.getElementById('pm-app')
);

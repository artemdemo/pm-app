import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {createHistory} from 'history'
import {createStore, combineReducers} from 'redux';
import promises from 'es6-promise';

import './styles/general.less';

import {AppView} from './views/AppView';
import {MainView} from './views/MainView';
import {LoginView} from './views/LoginView';
import tasks from './reducers/tasks';

promises.polyfill();

const history = useRouterHistory(createHistory)({
    basename: '/'
})

const pmApp = combineReducers({
    tasks
});

const store = createStore(pmApp);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={AppView}>
                <IndexRoute component={MainView} />
                <Route path='login' component={LoginView} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('pm-app')
);

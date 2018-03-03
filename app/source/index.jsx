import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
    Router,
    Route,
} from 'react-router-dom';
import PromiseBluebird from 'bluebird';
import history from './history';
import store from './store';

import './styles/general.less';

import AppView from './views/AppView';

PromiseBluebird.config({
    warnings: false,
    cancellation: true,
});

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={AppView} />
        </Router>
    </Provider>,
    document.getElementById('pm-app')
);

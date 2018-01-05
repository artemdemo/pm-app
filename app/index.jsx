import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import store from './store';

import './styles/general.less';

import AppView from './views/AppView';

render(
    <Provider store={store}>
        <Router>
            <Route path='/' component={AppView} />
        </Router>
    </Provider>,
    document.getElementById('pm-app')
);

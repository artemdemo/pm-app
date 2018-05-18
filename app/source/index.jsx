import React from 'react';
import { render } from 'react-dom';
import Bluebird from 'bluebird';
import RouteProvider from './routes/RouteProvider';
import { requestRoutes } from './model/routes/routesSagas';
import history from './history';
import store from './store';
import authorization from './components/Authorization/authorization';

import './styles/general.less';

Bluebird.config({
    warnings: false,
    cancellation: true,
});

const loadComponent = componentName => new Promise((resolve) => {
    return import(
        /* webpackChunkName: "view/[request]" */
        `./views/components/${componentName}`
    )
        .then((response) => {
            resolve(response.default);
        });
});

render(
    <RouteProvider
        store={store}
        history={history}
        requestRoutes={requestRoutes}
        loadComponent={loadComponent}
        authorization={authorization}
    />,
    document.getElementById('pm-app')
);

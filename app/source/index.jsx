import React from 'react';
import { render } from 'react-dom';
import Bluebird from 'bluebird';
import { LocalizeProvider } from 'react-localize-redux';
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
    <LocalizeProvider>
        <RouteProvider
            store={store}
            history={history}
            requestRoutes={requestRoutes}
            loadComponent={loadComponent}
            authorization={authorization}
        />
    </LocalizeProvider>,
    document.getElementById('pm-app')
);

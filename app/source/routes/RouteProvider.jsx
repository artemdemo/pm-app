import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

const pathRedirect = (path = '') => ({
    onEnter: (nextState, replace) => replace(`${path}/`),
});

/**
 * Asynchronous router provider
 */
class RouteProvider extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            routes: null,
        };
    }

    componentDidMount() {
        const { requestRoutes } = this.props;
        requestRoutes().then((result) => {
            this.loadRoutes(result.routes);
        });
    }

    loadRoutes(routes) {
        const { loadComponent, publicPath, authorization } = this.props;

        const wrapComponentWithAuthorization = (item, cb) => (component) => {
            const authComponent = !authorization || item._checkAuth === false ? component : authorization(component);
            return cb(
                null,
                authComponent,
            );
        };

        const processChildren = (children) => {
            return children.map((item) => {
                const result = (() => {
                    if (item._component) {
                        return Object.assign(item, {
                            getComponent: (nextState, cb) => {
                                loadComponent(item._component)
                                    .then(wrapComponentWithAuthorization(item, cb));
                            },
                        });
                    }
                    if (item._redirect) {
                        return Object.assign(item, {
                            indexRoute: pathRedirect(publicPath),
                        });
                    }
                    return item;
                })();
                if (item.indexRoute) {
                    result.indexRoute = Object.assign(item.indexRoute, {
                        getComponent: (nextState, cb) => {
                            loadComponent(item.indexRoute._component)
                                .then(wrapComponentWithAuthorization(item.indexRoute, cb));
                        },
                    });
                }
                if (item.childRoutes) {
                    result.childRoutes = processChildren(item.childRoutes);
                }
                return result;
            });
        };
        this.setState({
            routes: processChildren(routes),
        });
    }

    render() {
        const { store, history } = this.props;
        if (this.state.routes) {
            return (
                <Provider store={store}>
                    <Router routes={this.state.routes} history={history} />
                </Provider>
            );
        }
        return null;
    }
}

RouteProvider.propTypes = {
    store: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
    requestRoutes: PropTypes.func.isRequired,
    loadComponent: PropTypes.func.isRequired,
    authorization: PropTypes.func,
    publicPath: PropTypes.string,
};

RouteProvider.defaultProps = {
    authorization: null,
    publicPath: '',
};

export default RouteProvider;

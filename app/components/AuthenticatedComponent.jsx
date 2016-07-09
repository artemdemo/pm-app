import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from '../configs';

export function requireAuthentication(Component) {

    class AuthenticatedComponent extends Component {

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            if (!this.props.token) {
                let redirectAfterLogin = this.props.location.pathname;
                history.push(`/login?next=${redirectAfterLogin}`);
            }
        }

        render() {
            return (
                <div>
                    {this.props.token
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    return connect(
        state => {
            return {
                token: state.user.token
            }
        }
    )(AuthenticatedComponent);

}

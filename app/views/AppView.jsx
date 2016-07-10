import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuthentication } from '../actions/user';
import UserNotificator from '../components/UserNotificator/UserNotificator';

class AppView extends Component {
    componentWillMount() {
        const { checkAuthentication, location } = this.props;
        checkAuthentication(location);
    }

    render() {
        return (
            <div className='app'>
                <UserNotificator />
                {this.props.children}
            </div>
        );
    }
}


export default connect(
    () => {
        return {};
    },
    {
        checkAuthentication,
    }
)(AppView);

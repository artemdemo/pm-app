import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainMenu } from '../components/MainMenu/MainMenu';
import { checkAuthentication } from '../actions/user';
import UserNotificator from '../components/UserNotificator/UserNotificator';

class AppView extends Component {
    constructor(props) {
        super(props);
        const { checkAuthentication } = props;
        checkAuthentication();
    }

    render() {
        return (
            <div className='app'>
                <UserNotificator></UserNotificator>
                {this.props.children}
            </div>
        );
    }
}


export default connect(
    state => {
        return {}
    },
    {
        checkAuthentication
    }
)(AppView);

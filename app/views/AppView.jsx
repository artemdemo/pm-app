import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuthentication } from '../model/actions/user';
import UserNotificator from '../components/UserNotificator/UserNotificator';
import Popup from '../components/Popup/Popup';
import Modal from '../components/Modal/Modal';

class AppView extends Component {
    componentWillMount() {
        const { checkAuthentication, location } = this.props;
        checkAuthentication(location);
    }

    render() {
        return (
            <div className='app'>
                <UserNotificator />
                <Popup />
                <Modal />
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

import React from 'react';
import { connect } from 'react-redux';
import { checkAuthentication } from '../model/user/userActions';
import UserNotificator from '../containers/UserNotificator/UserNotificator';
import Popup from '../containers/Popup/Popup';
import Modal from '../containers/Modal/Modal';

class AppView extends React.PureComponent {
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

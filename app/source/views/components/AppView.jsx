import React from 'react';
import LoginController from '../../controllers/LoginController';
import UserNotificator from '../../containers/UserNotificator/UserNotificator';
import Modal from '../../containers/Modal/Modal';

class AppView extends React.PureComponent {
    render() {
        return (
            <div className='app'>
                <LoginController />
                <UserNotificator />
                <Modal />

                {this.props.children}
            </div>
        );
    }
}


export default AppView;

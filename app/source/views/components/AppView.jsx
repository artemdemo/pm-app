import React from 'react';
import LoginController from '../../controllers/LoginController';
import UserNotificator from '../../containers/UserNotificator/UserNotificator';
import Modal from '../../containers/Modal/Modal';
import MainMenu from '../../containers/MainMenu/MainMenu';
import auth from '../../services/auth';

class AppView extends React.PureComponent {
    renderMenu() {
        if (auth.isAuthorized()) {
            return (
                <MainMenu />
            );
        }
        return null;
    }

    render() {
        return (
            <div className='app'>
                {this.renderMenu()}

                <LoginController />
                <UserNotificator />
                <Modal />

                {this.props.children}
            </div>
        );
    }
}


export default AppView;

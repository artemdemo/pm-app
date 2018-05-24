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
            <React.Fragment>
                {this.renderMenu()}

                <LoginController />
                <UserNotificator />
                <Modal />

                <div className='container'>
                    {this.props.children}
                </div>
            </React.Fragment>
        );
    }
}


export default AppView;

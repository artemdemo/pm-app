import React from 'react';
import LoginController from '../../controllers/LoginController';
import Notificator from '../../components/Notificator/Notificator';
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

                <div className='container'>
                    {this.props.children}
                </div>
                <Notificator />
            </React.Fragment>
        );
    }
}


export default AppView;

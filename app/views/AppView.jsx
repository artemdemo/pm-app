import React from 'react';
import { connect } from 'react-redux';
import {
    Route,
} from 'react-router-dom';
import { checkAuthentication } from '../model/user/userActions';
import UserNotificator from '../containers/UserNotificator/UserNotificator';
import Popup from '../containers/Popup/Popup';
import Modal from '../containers/Modal/Modal';
import ProjectsView from './ProjectsView';
import TasksView from './TasksView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import LoginView from './LoginView';
import SignupView from './SignupView';
import ScrumView from './ScrumView';
import MainView from './MainView';

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

                <Route exact path='/' component={MainView} />
                <Route path='/login' component={LoginView} />
                <Route path='/signup' component={SignupView} />
                <Route path='/profile' component={ProfileView} />
                <Route path='/settings' component={SettingsView} />
                <Route path='/tasks' component={TasksView} />
                <Route path='/scrum' component={ScrumView} />
                <Route path='/projects' component={ProjectsView} />
            </div>
        );
    }
}


export default connect(
    () => ({}),
    {
        checkAuthentication,
    }
)(AppView);

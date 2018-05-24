import React from 'react';
import { connect } from 'react-redux';
import { loadTasks, resetTasks } from '../model/tasks/tasksActions';
import { loadProjects, resetProjects } from '../model/projects/projectsActions';
import { loadBoards, resetBoards } from '../model/boards/boardsActions';
import { loadUser, resetUser } from '../model/auth/authActions';
import auth from '../services/auth';
import { setDefaultHeader } from '../services/request';

class LoginController extends React.PureComponent {
    componentDidMount() {
        if (auth.isAuthorized()) {
            this.loadData();
        }
    }

    componentDidUpdate(prevProps) {
        const loggedIn = prevProps.auth.login === true &&
            this.props.auth.login === false &&
            this.props.auth.loginError === null;
        const signedUp = prevProps.auth.signup === true &&
            this.props.auth.signup === false &&
            this.props.auth.signupError === null;

        if ((loggedIn || signedUp) && auth.isAuthorized()) {
            this.resetData();
            // I'm loading all data even after signing up
            // For now it's not so relevant, but in the future user could have some basic tasks,
            // so it's good to have this call just in case
            this.loadData();
        }
    }

    loadData() {
        const { loadTasks, loadProjects, loadBoards, loadUser } = this.props;
        const tokenInstance = auth.getToken();
        setDefaultHeader('authorization', `Bearer ${tokenInstance.token}`);
        loadTasks();
        loadProjects();
        loadBoards();
        loadUser();
    }

    resetData() {
        const { resetTasks, resetProjects, resetBoards, resetUser } = this.props;
        resetTasks();
        resetProjects();
        resetBoards();
        resetUser();
    }

    render() {
        return null;
    }
}

export default connect(
    state => ({
        auth: state.auth,
    }), {
        loadUser,
        loadTasks,
        loadProjects,
        loadBoards,
        resetTasks,
        resetProjects,
        resetBoards,
        resetUser,
    }
)(LoginController);

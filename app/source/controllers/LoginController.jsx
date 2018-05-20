import React from 'react';
import { connect } from 'react-redux';
import { loadTasks } from '../model/tasks/tasksActions';
import { loadProjects } from '../model/projects/projectsActions';
import { loadBoards } from '../model/boards/boardsActions';
import { loadUser } from '../model/auth/authActions';
import auth from '../services/auth';
import { setDefaultHeader } from '../services/request';

class LoginController extends React.PureComponent {
    componentDidMount() {
        if (auth.isAuthorized()) {
            this.loadData();

            // I need to load user data only if he is already logged in
            const { loadUser } = this.props;
            loadUser();
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
            // I'm loading all data even after signing up
            // For now it's not so relevant, but in the future user could have some basic tasks,
            // so it's good to have this call just in case
            this.loadData()
        }
    }

    loadData() {
        const { loadTasks, loadProjects, loadBoards } = this.props;
        const tokenInstance = auth.getToken();
        setDefaultHeader('authorization', `Bearer ${tokenInstance.token}`);
        loadTasks();
        loadProjects();
        loadBoards();
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
    }
)(LoginController);

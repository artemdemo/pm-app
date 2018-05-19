import React from 'react';
import { connect } from 'react-redux';
import { loadTasks } from '../model/tasks/tasksActions';
import { loadProjects } from '../model/projects/projectsActions';
import { loadBoards } from '../model/boards/boardsActions';
import auth from '../services/auth';
import { setDefaultHeader } from '../services/request';

class LoginController extends React.PureComponent {
    componentDidMount() {
        if (auth.isAuthorized()) {
            this.loadData()
        }
    }

    componentDidUpdate(prevProps) {
        const loggedIn = prevProps.login === true &&
            this.props.auth.login === false &&
            this.props.auth.loginError === null;

        if (loggedIn && auth.isAuthorized()) {
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
        loadTasks,
        loadProjects,
        loadBoards,
    }
)(LoginController);

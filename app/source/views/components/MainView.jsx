import React from 'react';
import { connect } from 'react-redux';

const MainView = (props) => {
    const { tasks, projects } = props;
    const doneTasks = tasks.data.filter(task => task.done).length;

    return (
        <React.Fragment>
            <h4>Tasks</h4>
            <p>
                Total: {tasks.data.length}<br />
                In process: {tasks.data.length - doneTasks}<br />
                Done: {doneTasks}<br />
            </p>

            <h4>Projects</h4>
            <p>
                Total: {projects.data.length}<br />
            </p>
        </React.Fragment>
    );

};

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
    })
)(MainView);

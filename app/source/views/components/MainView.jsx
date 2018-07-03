import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';

const MainView = (props) => {
    const { tasks, projects } = props;
    const doneTasks = tasks.data.filter(task => task.done).length;

    return (
        <React.Fragment>
            <h4><Translate id='tasks' /></h4>
            <p>
                <Translate id='total' />: {tasks.data.length}<br />
                <Translate id='in-process' />: {tasks.data.length - doneTasks}<br />
                <Translate id='done' />: {doneTasks}<br />
            </p>

            <h4><Translate id='projects' /></h4>
            <p>
                <Translate id='total' />: {projects.data.length}<br />
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

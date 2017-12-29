import React from 'react';
import { connect } from 'react-redux';
import MainMenu from '../components/MainMenu/MainMenu';

const MainView = (props) => {
    const { tasks, projects } = props;
    const doneTasks = tasks.filter(task => task.done).length;

    return (
        <div>
            <MainMenu />

            <div className='list-container'>
                <div className='list-container__list'>
                    <h4>Tasks</h4>
                    <p>
                        Total: {tasks.length}<br />
                        In process: {tasks.length - doneTasks}<br />
                        Done: {doneTasks}<br />
                    </p>

                    <h4>Projects</h4>
                    <p>
                        Total: {projects.length}<br />
                    </p>
                </div>
            </div>
        </div>
    );

};

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
    })
)(MainView);

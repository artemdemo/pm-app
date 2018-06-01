import React from 'react';
import TasksList from '../../containers/TasksList/TasksList';

const TasksView = (props) => {
    return (
        <React.Fragment>
            <TasksList />
            {props.children}
        </React.Fragment>
    );
};

export default TasksView;

import React from 'react';
import PropTypes from 'prop-types';
import TasksListItem from './TasksListItem';

class TasksList extends React.PureComponent {
    filterTasks(tasksList) {
        const { byProject, byStatus } = this.props;
        const filteredByStatus = tasksList
            .filter((task) => {
                switch (byStatus) {
                    case 'active':
                        return task.done === false;
                    case 'completed':
                        return task.done === true;
                    default:
                        return true;
                }
            });

        const projectId = parseInt(byProject, 10);
        if (Number.isInteger(projectId)) {
            return filteredByStatus.filter((task) => {
                return !!task.projects.find(item => item.id === projectId);
            });
        }
        // when byProject === 'all'
        // and in all default cases
        return filteredByStatus;
    }

    render() {
        const { tasks, byProject } = this.props;
        const tasksList = this.filterTasks(tasks);
        const newTask = {
            name: '',
            description: '',
        };
        return (
            <React.Fragment>
                <TasksListItem
                    task={newTask}
                    projectId={byProject}
                    key='task-0'
                />
                {tasksList.map(task => (
                    <TasksListItem
                        task={task}
                        key={`task-list-item-${task.id}`}
                    />
                ))}
            </React.Fragment>
        );
    }
}

TasksList.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({})),
    byProject: PropTypes.string,
    byStatus: PropTypes.any,
};

TasksList.defaultProps = {
    tasks: [],
    byProject: 'all',
    byStatus: null,
};

export default TasksList;

import React from 'react';
import PropTypes from 'prop-types';
import _isNumber from 'lodash/isNumber';
import _isNaN from 'lodash/isNaN';
import TasksListItem from './TasksListItem';

class TasksList extends React.PureComponent {
    filterTasks(tasksList) {
        const { byProjectId, byStatusId } = this.props;
        const filteredByStatus = tasksList
            .filter((task) => {
                switch (byStatusId) {
                    case 'active':
                        return task.done === false;
                    case 'completed':
                        return task.done === true;
                    default:
                        return true;
                }
            });
        const resultList = (() => {
            const projectId = (() => {
                const projectIdNumber = parseInt(byProjectId, 10);
                if (_isNaN(projectIdNumber)) {
                    return byProjectId;
                }
                return projectIdNumber;
            })();
            switch (true) {
                case projectId === 'free':
                    return filteredByStatus.filter((task) => {
                        return task.projects.length === 0;
                    });
                case _isNumber(projectId):
                    return filteredByStatus.filter((task) => {
                        return task.projects.indexOf(projectId) > -1;
                    });
                case projectId === 'all':
                default:
                    return filteredByStatus;
            }
        })();
        return resultList;
    }

    render() {
        const { tasks, byProjectId } = this.props;
        const tasksList = this.filterTasks(tasks);
        const newTask = {
            name: '',
            description: '',
        };
        return (
            <React.Fragment>
                <TasksListItem
                    task={newTask}
                    projectId={byProjectId}
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
    byProjectId: PropTypes.string,
    byStatusId: PropTypes.any,
};

TasksList.defaultProps = {
    tasks: [],
    byProjectId: 'all',
    byStatusId: null,
};

export default TasksList;

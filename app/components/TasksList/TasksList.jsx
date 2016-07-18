import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RadioMenu } from '../RadioMenu/RadioMenu';
import TasksListItem from './TasksListItem';

import './TasksList.less';

class TasksList extends Component {
    addNewTask() {

    }

    render() {
        const { tasks } = this.props;
        const listMenu = [
            { id: 1, name: 'All'},
            { id: 2, name: 'Active' },
            { id: 3, name: 'Completed' },
        ];
        return (
            <div>
                <RadioMenu list={listMenu} />
                <div className="tasks-list">
                    {tasks.map(task => (
                        <TasksListItem task={task} key={`task-${task.id}`} />
                    ))}
                </div>
                <button className="btn btn-default" onClick={this.addNewTask} data-qa="add-new-task">New Task</button>
            </div>
        );
    }
}

TasksList.propTypes = {
    tasks: React.PropTypes.arrayOf(React.PropTypes.object)
}

export default connect(
    state => {
        return {
            tasks: state.tasks,
        }
    }
)(TasksList);

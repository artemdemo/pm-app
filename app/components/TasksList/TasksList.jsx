import React, { Component } from 'react';
import { connect } from 'react-redux';

import './TasksList.less';

class TasksList extends Component {
    addNewTask() {

    }

    render() {
        const { tasks } = this.props;

        return (
            <div>
                <div className="tasks-list">
                    {tasks.map(task => (
                        task.name
                    ))}
                </div>
                <button className="btn btn-default" onClick={this.addNewTask} data-qa="add-new-task">New Task</button>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            tasks: state.tasks,
        }
    }
)(TasksList);

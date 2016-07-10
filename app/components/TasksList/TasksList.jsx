import React, { Component } from 'react';

import './TasksList.less';

export class TasksList extends Component {
    addNewTask() {

    }

    render() {
        const { tasks } = this.props;

        return (
            <div>
                <div class="tasks-list">
                    {tasks.map(task => (
                        task.name
                    ))}
                </div>
                <button class="btn btn-default" onClick={this.addNewTask} data-qa="add-new-task">New Task</button>
            </div>
        );
    }
}

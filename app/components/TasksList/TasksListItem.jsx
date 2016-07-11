import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OkCircle } from '../OkCircle/OkCircle';

import './TasksListItem.less';

export default class TasksListItem extends Component {
    constructor(props) {
        super(props);
        this.isLoading = false;
    }

    toggleDone() {}

    selectTask() {}

    render() {
                        // tasks-list-item__text_done
        const itemClass = 'tasks-list-item__text';
        const { task } = this.props;
        return (
            <div className='tasks-list-item'>
                <div className='tasks-list-item__cell
                            tasks-list-item__cell_icon'
                            onClick={this.toggleDone}>
                    <OkCircle status={task.done} loading={this.isLoading} />
                </div>
                <div className='tasks-list-item__cell' onClick={this.selectTask}>
                    <span className={itemClass}>
                        {task.name}
                    </span>
                </div>
                <div className='tasks-list-item__cell
                            tasks-list-item__cell_labels'>
                </div>
                <div className='tasks-list-item__cell
                            tasks-list-item__cell_icon'>
                </div>
            </div>
        );
    }
}

export default connect(
    () => {
        return {}
    },
    {}
)(TasksListItem);

/*
<div className='tasks-list-item'>
    <div className='tasks-list-item__cell
                tasks-list-item__cell_icon'
                onClick={this.toggleDone}>
        <ok-circle [status]='task.done' [loading]='isLoading'></ok-circle>
    </div>
    <div className='tasks-list-item__cell' onClick={this.selectTask}>
        <span className={itemClass}>
            {task.name}
        </span>
    </div>
    <div className='tasks-list-item__cell
                tasks-list-item__cell_labels'>
        <labels-list className='labels-list_short-content'
                     [list]='selectedProjects'
                     [limit]='1'></labels-list>
    </div>
    <div className='tasks-list-item__cell
                tasks-list-item__cell_icon'>
        <span className='glyphicon glyphicon-triangle-right'
              aria-hidden='true'
              *ngIf='selectedTask && selectedTask.id == task.id'></span>
    </div>
</div>
*/

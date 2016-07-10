import React, { Component } from 'react';

import './TasksListItem.less';

export class TasksListItem extends Component {
    toggleDone() {}

    selectTask() {}

    render() {
        return (
            <div class="tasks-list-item">
                <div class="tasks-list-item__cell
                            tasks-list-item__cell_icon"
                            onClick={this.toggleDone}>
                    <ok-circle [status]="task.done" [loading]="isLoading"></ok-circle>
                </div>
                <div class="tasks-list-item__cell" onClick={this.selectTask}>
                    <span class="tasks-list-item__text"
                          [ngClass]="{'tasks-list-item__text_done' : task.done}">
                        {{ task.name }}
                    </span>
                </div>
                <div class="tasks-list-item__cell
                            tasks-list-item__cell_labels">
                    <labels-list class="labels-list_short-content"
                                 [list]="selectedProjects"
                                 [limit]="1"></labels-list>
                </div>
                <div class="tasks-list-item__cell
                            tasks-list-item__cell_icon">
                    <span class="glyphicon glyphicon-triangle-right"
                          aria-hidden="true"
                          *ngIf="selectedTask && selectedTask.id == task.id"></span>
                </div>
            </div>
        );
    }
}

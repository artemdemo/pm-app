import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ProjectsListItem.less';

class ProjectsListItem extends Component {
    constructor(props) {
        super(props);

        this.tasks = props.tasks;
        this.project = props.project;

        this.renderTasks = () => {
            if (this.project.tasks.length > 0) {
                return (
                    <div>
                        <div className='text-muted'>
                            Tasks: { this.filterTasks('all').length }
                        </div>
                        <div className='text-muted'>
                            Done: { this.filterTasks('done').length }
                        </div>
                    </div>
                );
            }
            return null;
        }
    }

    selectProject() {}


    filterTasks(filter) {
        if (this.project.tasks.length === 0) {
            return [];
        }
        switch (filter) {
            case 'done':
                return this.tasks.filter((task) => {
                    return task.done === true && this.project.tasks.indexOf(task.id) !== -1;
                });
            case 'all':
            default:
                return this.tasks.filter((task) => {
                    return this.project.tasks.indexOf(task.id) !== -1;
                });
        }
    }

    render() {
        const { project } = this.props;
        return (
            <div className='projects-list-item'
                 onClick={this.selectProject}>
                <div className='projects-list-item__title'>
                    { project.name }
                </div>
                { this.renderTasks() }
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            tasks: state.tasks
        }
    }
)(ProjectsListItem);

/*
<div class="projects-list-item"
     [ngClass]="{'projects-list-item_selected': selectedProject && selectedProject.id == project.id}"
     (click)="selectTask()">
    <div class="projects-list-item__title"
         [ngClass]="{'projects-list-item__title_has-items': project.tasks.length > 0}">
        {{ project.name }}
    </div>
    <div *ngIf="project.tasks.length > 0">
        <canvas #chartСanvas class="projects-list-item__donut-tasks" height="100"></canvas>
        <div class="text-muted">
            Tasks: {{ filterTasks('all').length }}
        </div>
        <div class="text-muted">
            Done: {{ filterTasks('done').length }}
        </div>
    </div>
</div>
*/

import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { LabelsList } from '../LabelsList/LabelsList';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { clearEntity } from '../../actions/selectedEntity';
import * as entityConst from '../../constants/selectedEntity';

class SingleTask extends Component {
    constructor(props) {
        super(props);
        this.loadingData = false;
        this.submitTask = () => {}
        this.disconnectProject = () => {}

    }

    render() {
        const cancelButtonClass = classnames({
            'btn': true,
            'btn-default': true,
            'btn_disabled': this.loadingData
        });
        const renderLoadingSpinner = () => {
            if (this.loadingData) {
                return (
                    <span className='btn btn-link'>
                        <LoadingSpinner />
                    </span>
                );
            }
            return null;
        }
        const selectedProjects = [];
        let { task, clearEntity } = this.props;
        task = task || {};

        return (
            <div className='single-panel'>
                <form onSubmit={this.submitTask}>
                    <div className='form-group'>
                        <input type='text'
                               name='name'
                               className='flat-input'
                               placeholder='Task name'
                               data-qa='task-name' />
                    </div>
                    <div className='form-group'>
                        <textarea className='flat-input'
                                  name='description'
                                  rows='3'
                                  data-qa='task-description'></textarea>
                    </div>
                    <div className='form-group'>
                        <ok-circle status='taskModel.done'
                                   onClick={this.toggleDone}>Mark done</ok-circle>
                    </div>
                    <div className='form-group'>
                        <LabelsList list={selectedProjects}
                                    delitable={true}
                                    onDelete={this.disconnectProject} />
                    </div>
                    <div className='form-group'>
                    </div>
                    <div className='form-group'>
                        <select className='form-control'
                                name='board'>

                        </select>
                    </div>
                    <div className='form-group text-muted'>
                        <p>Task Added: { task.added }</p>
                        <p>Last updated: { task.updated }</p>
                    </div>
                    <div className='clearfix'>
                        <div className='pull-left'>
                            <button type='submit'
                                    className='btn btn-primary'
                                    data-qa='task-save'>
                                <span>Add new</span>
                                <span>Save</span>
                            </button>
                            <span className={cancelButtonClass}
                                  onClick={() => clearEntity(entityConst.ENTITY_TASK)}
                                  data-qa='task-cancel'>Cancel</span>
                            {renderLoadingSpinner()}
                        </div>
                        <div className='pull-right'>
                            <DeleteButton />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

SingleTask.propTypes = {
    task: React.PropTypes.object
}

export default connect(
    state => {
        return {}
    },
    {
        clearEntity
    }
)(SingleTask);


// <div class="single-panel">
//     <form (ngSubmit)="submitTask()" *ngIf="taskModel">
//         <div class="form-group">
//             <input type="text"
//                    name="name"
//                    class="flat-input"
//                    placeholder="Task name"
//                    [(ngModel)]="taskModel.name"
//                    data-qa="task-name">
//         </div>
//         <div class="form-group">
//             <textarea class="flat-input"
//                       name="description"
//                       rows="3"
//                       [(ngModel)]="taskModel.description"
//                       data-qa="task-description"></textarea>
//         </div>
//         <div class="form-group">
//             <ok-circle [status]="taskModel.done" (click)="toggleDone()">Mark done</ok-circle>
//         </div>
//         <div class="form-group">
//             <labels-list [list]="selectedProjects"
//                          [delitable]="true"
//                          (onDelete)="disconnectProject($event)">
//             </labels-list>
//         </div>
//         <div class="form-group">
//             <dropdown-list [list]="availableProjects"
//                            placeholder="Connect to project"
//                            (onSelect)="connectProject($event)"></dropdown-list>
//         </div>
//         <div class="form-group">
//             <select class="form-control"
//                     name="board"
//                     [(ngModel)]="taskModel.board_id">
//                 <option [value]="board.id" *ngFor="let board of boardsList">{{ board.name }}</option>
//             </select>
//         </div>
//         <div class="form-group text-muted" *ngIf="task.added">
//             <p>Task Added: {{ task.added }}</p>
//             <p>Last updated: {{ task.updated }}</p>
//         </div>
//         <div class="clearfix">
//             <div class="pull-left">
//                 <button type="submit"
//                         class="btn btn-primary"
//                         [disabled]="loadingData"
//                         data-qa="task-save">
//                     <span *ngIf="!task.id">Add new</span>
//                     <span *ngIf="task.id">Save</span>
//                 </button>
//                 <span class="btn btn-default"
//                       (click)="cancel()"
//                       [ngClass]="{btn_disabled: loadingData}"
//                       data-qa="task-cancel">Cancel</span>
//                 <span class="btn btn-link" *ngIf="loadingData">
//                     <loading-spinner></loading-spinner>
//                 </span>
//             </div>
//             <div class="pull-right" *ngIf="task.id">
//                 <delete-btn (onDelete)="deleteTask()" data-qa="task-delete"></delete-btn>
//             </div>
//         </div>
//     </form>
// </div>

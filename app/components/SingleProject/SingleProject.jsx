import react, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

class SingleProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            loadingData: false,
            selectedTasks,
            availableTasks,
        };

        this.submitProject = (e) => {
            e.preventDefault();
        }
    }

    render() {
        const renderLoadingSpinner = () => {
            if (this.state.loadingData) {
                return (
                    <span className='btn btn-link'>
                        <LoadingSpinner />
                    </span>
                );
            }
            return null;
        }
        return (
            <form onSubmit={this.submitProject} className='single-panel'>
                <div className='form-group'>
                    <input type='text'
                           name='name'
                           className='flat-input'
                           placeholder='Project name'
                           onChange={(e) => this.setState({
                                name: e.target.value
                           })}
                           data-qa='project-name' />
                </div>
                <div className='form-group'>
                    <textarea className='flat-input'
                              name='description'
                              rows='3'
                              onChange={(e) => this.setState({
                                   description: e.target.value
                              })}
                              data-qa='project-description'></textarea>
                </div>
                <div className='form-group'>
                    <div className='single-panel__subtitle' *ngIf='selectedTasks.length > 0'>
                        Tasks
                    </div>
                    <narrow-list [list]='selectedTasks'
                                 [delitable]='true'
                                 (onDelete)='disconnectTask($event)'>
                    </narrow-list>
                </div>
                <div className='form-group'>
                    <dropdown-list [list]='availableTasks'
                                   placeholder='Connect task'
                                   (onSelect)='connectTask($event)'></dropdown-list>
                </div>
                <div className='form-group text-muted' *ngIf='project.added'>
                    <p>Project Added: {{ project.added }}</p>
                    <p>Last updated: {{ project.updated }}</p>
                </div>
                <div className='clearfix'>
                    <div className='pull-left'>
                        <button type='submit' className='btn btn-primary' [disabled]='loadingData'>
                            <span *ngIf='!project.id'>Add new</span>
                            <span *ngIf='project.id'>Save</span>
                        </button>
                        <span className='btn btn-default'
                              (click)='cancel()'
                              [ngClass]='{btn_disabled: loadingData}'>Cancel</span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='pull-right' *ngIf='project.id'>
                        <delete-btn (onDelete)='deleteProject()'></delete-btn>
                    </div>
                </div>
            </form>
        );
    }
}

export default connect(
    () => {
        return {}
    }, {}
)(SingleProject);

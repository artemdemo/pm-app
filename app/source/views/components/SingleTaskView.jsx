import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _isString from 'lodash/isString';
import { filterProjects } from '../../utils/tasks';
import { deleteTask, updateTask } from '../../model/tasks/tasksActions';
import LabelsList from '../../components/LabelsList/LabelsList';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OkCircle from '../../components/OkCircle/OkCircle';
import DropdownList from '../../components/DropdownList/DropdownList';
import DeleteButton from '../../components/DeleteButton/DeleteButton';

class SingleTaskView extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        id='exampleFormControlInput1'
                        placeholder='Task name'
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        rows='3'
                    />
                </div>
                <div className='form-group'>
                    <OkCircle
                        doneStatus={this.state.done}
                        onChange={this.toggleDone.bind(this)}
                    >
                        Mark done
                    </OkCircle>
                </div>
                <div className='form-group'>
                    <LabelsList
                        list={this.state.selectedProjects}
                        onDelete={this.disconnectProject.bind(this)}
                        delitable
                    />
                </div>
                <div className='form-group'>
                    <DropdownList
                        list={this.state.availableProjects}
                        placeholder='Connect to project'
                        onSelect={this.connectProject.bind(this)}
                    />
                </div>
                <div className='form-group text-muted'>
                    <p>Task Added: {task.added}</p>
                    <p>Last updated: {task.updated}</p>
                </div>
                <div className='row justify-content-between'>
                    <div className='col-6'>
                        <span className='buttons-group'>
                            <button
                                className='btn btn-primary'
                                onClick={this.submitTask.bind(this)}
                                data-qa='task-save'
                            >
                                <span>Save</span>
                            </button>
                            <span
                                className={cancelButtonClass}
                                onClick={() => onCancel()}
                                data-qa='task-cancel'
                            >
                                Cancel
                            </span>
                        </span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='col-4'>
                        <DeleteButton onDelete={this.deleteTask.bind(this)} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SingleTaskView;

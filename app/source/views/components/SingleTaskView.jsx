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
import EntityModal from '../../components/EntityModal/EntityModal';
import { loadSingleTask } from '../../model/tasks/tasksActions';

class SingleTaskView extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedProjects: [],
            availableProjects: [],
        };
    }

    componentDidMount() {
        const { loadSingleTask, params } = this.props;
        loadSingleTask(params.taskId);
    }

    render() {
        const task = {};
        return (
            <EntityModal>
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
                        placeholder='Task description'
                        rows='3'
                    />
                </div>
                <div className='form-group'>
                    <OkCircle
                        doneStatus={this.state.done}
                        onChange={this.toggleDone}
                    >
                        Mark done
                    </OkCircle>
                </div>
                <div className='form-group'>
                    <LabelsList
                        list={this.state.selectedProjects}
                        onDelete={this.disconnectProject}
                        delitable
                    />
                </div>
                <div className='form-group'>
                    <DropdownList
                        list={this.state.availableProjects}
                        placeholder='Connect to project'
                        onSelect={this.connectProject}
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
                                onClick={this.submitTask}
                                data-qa='task-save'
                            >
                                <span>Save</span>
                            </button>
                            <button
                                className='btn btn-light'
                            >
                                Cancel
                            </button>
                        </span>
                    </div>
                    <div className='col-4'>

                    </div>
                </div>
            </EntityModal>
        );
    }
}

export default connect(
    () => ({}), {
        loadSingleTask,
    }
)(SingleTaskView);

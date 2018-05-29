import React from 'react';
import PropTypes from 'prop-types';
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
import InputMd from '../../components/InputMd/InputMd';
import TextareaMd from '../../components/TextareaMd/TextareaMd';

import './SingleTask.less';

class SingleTask extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            done: false,
            priority: 0,
            loadingData: false,
            selectedProjects: [],
            availableProjects: [],
        };
    }

    componentDidMount() {
        this.setupData();
    }

    componentWillReceiveProps(nextProps) {
        this.setupData(nextProps);
    }

    setupData(props = this.props) {
        const { task, projects } = props;
        const { selectedProjects, availableProjects } = filterProjects(task, projects.data);
        this.setState({
            name: task.name || '',
            description: task.description || '',
            done: task.done || false,
            loadingData: false,
            selectedProjects,
            availableProjects,
        });
        if (_isString(task.due)) {
            this.dueInstance.setDate(task.due);
        }
    }

    connectProject(newProject) {
        this.setState({
            selectedProjects: this.state.selectedProjects.concat([newProject]),
            availableProjects: this.state.availableProjects.filter(project => project.id !== newProject.id),
        });
    }

    disconnectProject(newProject) {
        this.setState({
            selectedProjects: this.state.selectedProjects.filter(project => project.id !== newProject.id),
            availableProjects: this.state.availableProjects.concat([newProject]),
        });
    }

    deleteTask() {
        const { task, deleteTask, onDelete } = this.props;
        deleteTask(task.id);
        onDelete();
    }

    submitTask() {
        const { task, updateTask, onSave } = this.props;

        if (this.state.name === '') {
            return;
        }

        const updatedTaskData = {
            id: task.id,
            name: this.state.name,
            description: this.state.description,
            done: this.state.done,
            projects: this.state.selectedProjects.map(project => project.id),
        };
        this.setState({
            loadingData: true,
        });
        updateTask(Object.assign(task, updatedTaskData));
        onSave();
    }

    toggleDone(newDoneStatus) {
        this.setState({
            done: newDoneStatus,
        });
    }

    render() {
        const cancelButtonClass = classnames({
            btn: true,
            'btn-light': true,
            btn_disabled: this.state.loadingData,
        });
        const renderLoadingSpinner = () => {
            if (this.state.loadingData) {
                return (
                    <span className='btn btn-link'>
                        <LoadingSpinner />
                    </span>
                );
            }
            return null;
        };
        const { task, onCancel, className } = this.props;
        return (
            <div className={className}>
                <div className='form-group'>
                    <InputMd
                        type='text'
                        name='name'
                        value={this.state.name}
                        onChange={e => this.setState({
                            name: e.target.value,
                        })}
                        className='flat-input'
                        placeholder='Task name'
                        autoComplete='off'
                        key={`input-md-${task.id}`}
                        data-qa='task-name'
                    />
                </div>
                <div className='form-group'>
                    <TextareaMd
                        className='flat-input'
                        name='description'
                        rows='5'
                        value={this.state.description}
                        onChange={e => this.setState({
                            description: e.target.value,
                        })}
                        placeholder='No description'
                        key={`textarea-md-${task.id}`}
                        data-qa='task-description'
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
            </div>
        );
    }
}

SingleTask.propTypes = {
    task: PropTypes.shape({}),
    className: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

SingleTask.defaultProps = {
    task: {},
    className: '',
};

export default connect(
    state => ({
        projects: state.projects,
    }),
    {
        deleteTask,
        updateTask,
    }
)(SingleTask);

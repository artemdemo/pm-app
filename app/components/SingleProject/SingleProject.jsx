import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as entityConst from '../../model/constants/selectedEntity';
import { filterTasks } from '../../utils/tasks';
import { deleteProject, updateProject, addNewProject } from '../../model/actions/projects';
import { DropdownList } from '../DropdownList/DropdownList';
import { NarrowList } from '../NarrowList/NarrowList';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { InputMd } from '../InputMd/InputMd';
import { TextareaMd } from '../TextareaMd/TextareaMd';
import { clearEntity } from '../../model/actions/selectedEntity';
import { errorMessage } from '../../model/actions/notification';
import { showModal, hideModal } from '../../model/actions/modal';
import SingleTask from '../SingleTask/SingleTask';

class SingleProject extends Component {
    constructor(props) {
        super(props);

        const project = this.getProject();
        const { selectedTasks, availableTasks } = filterTasks(project, props.tasks);

        this.state = {
            name: '',
            description: '',
            loadingData: false,
            selectedTasks,
            availableTasks,
        };

        this.submitProject = (e) => {
            e.preventDefault();
            const { updateProject, addNewProject, errorMessage } = this.props;
            const project = this.getProject();

            if (this.state.name === '') {
                errorMessage('Name can\'t be empty');
                return;
            }

            const updatedProjectData = {
                name: this.state.name,
                description: this.state.description,
                tasks: this.state.selectedTasks.map(project => project.id),
            };
            this.setState({
                loadingData: true,
            });
            if (project.id) {
                updatedProjectData.id = project.id;
                updateProject(Object.assign(project, updatedProjectData));
            } else {
                addNewProject(updatedProjectData);
            }
        };

        this.deleteProject = () => {
            const project = this.getProject();
            const { deleteProject } = this.props;
            deleteProject(project.id);
        };

        this.connectTask = (newTask) => {
            this.setState({
                selectedTasks: this.state.selectedTasks.concat([newTask]),
                availableTasks: this.state.availableTasks.filter(task => task.id !== newTask.id),
            });
        };

        this.disconnectTask = (newTask) => {
            this.setState({
                selectedTasks: this.state.selectedTasks.filter(task => task.id !== newTask.id),
                availableTasks: this.state.availableTasks.concat([newTask]),
            });
        };

        this.openTask = (task) => {
            const { showModal, hideModal } = this.props;
            showModal(<SingleTask
                task={task}
                className='single-task-modal'
                onSave={() => hideModal()}
                onDelete={() => hideModal()}
                onCancel={() => hideModal()}
            />);
        };
    }

    componentWillReceiveProps(nextProps) {
        const project = this.getProject(nextProps);
        const { selectedTasks, availableTasks } = filterTasks(project, nextProps.tasks);

        this.setState({
            name: project.name || '',
            description: project.description || '',
            loadingData: false,
            selectedTasks,
            availableTasks,
        });
    }

    getProject(props = this.props) {
        return props.project || {};
    }

    render() {
        const { clearEntity } = this.props;
        const project = this.getProject();
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
        const renderSaveButton = () => {
            const text = project.id ? 'Save' : 'Add new';
            return (
                <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={this.state.loadingData}
                    data-qa='project-save'
                >
                    <span>{text}</span>
                </button>
            );
        };
        const renderNarrowList = () => {
            if (this.state.selectedTasks.length > 0) {
                return (
                    <NarrowList
                        list={this.state.selectedTasks}
                        deletable
                        onClick={task => this.openTask(task)}
                        onDelete={this.disconnectTask}
                    />
                );
            }
            return (
                <div className='text-muted' data-qa='no-tasks-label'>No tasks selected</div>
            );
        };
        const renderTime = () => {
            if (project.id) {
                return (
                    <div className='form-group text-muted'>
                        <p>Project added: {project.added}</p>
                        <p>Last updated: {project.updated}</p>
                    </div>
                );
            }
            return null;
        };
        const renderDeleteButton = () => {
            if (project && project.id) {
                return (
                    <DeleteButton onDelete={this.deleteProject} />
                );
            }
            return null;
        };
        return (
            <form onSubmit={this.submitProject} className='single-panel'>
                <div className='form-group'>
                    <InputMd
                        type='text'
                        name='name'
                        editMode={!project.id}
                        value={this.state.name}
                        onChange={e => this.setState({
                            name: e.target.value,
                        })}
                        className='flat-input'
                        placeholder='Project name'
                        autoComplete='off'
                        data-qa='project-name'
                    />
                </div>
                <div className='form-group'>
                    <TextareaMd
                        className='flat-input'
                        name='description'
                        rows='5'
                        editMode={!project.id || this.state.description === ''}
                        value={this.state.description}
                        onChange={e => this.setState({
                            description: e.target.value,
                        })}
                        placeholder='Project description'
                        data-qa='project-description'
                    />
                </div>
                <div className='form-group'>
                    <div className='single-panel__subtitle'>
                        Tasks
                    </div>
                    {renderNarrowList()}
                </div>
                <div className='form-group'>
                    <DropdownList
                        list={this.state.availableTasks}
                        placeholder='Connect tasks to project'
                        onSelect={this.connectTask}
                    />
                </div>
                {renderTime()}
                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            {renderSaveButton()}
                            <span
                                className='btn btn-default'
                                disabled={this.state.loadingData}
                                onClick={() => clearEntity(entityConst.ENTITY_PROJECT)}
                                data-qa='project-cancel'
                            >
                                Cancel
                            </span>
                        </span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='pull-right'>
                        {renderDeleteButton()}
                    </div>
                </div>
            </form>
        );
    }
}

SingleProject.propTypes = {
    project: PropTypes.shape({}),
    selectedEntity: PropTypes.shape({}),
};

export default connect(
    state => ({
        tasks: state.tasks,
        selectedEntity: state.selectedEntity,
    }), {
        clearEntity,
        deleteProject,
        updateProject,
        addNewProject,
        errorMessage,
        showModal,
        hideModal,
    }
)(SingleProject);

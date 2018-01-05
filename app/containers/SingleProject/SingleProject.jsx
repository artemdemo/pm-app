import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as entityConst from '../../model/constants/selectedEntity';
import { filterTasks } from '../../utils/tasks';
import { deleteProject, updateProject, addNewProject } from '../../model/actions/projects';
import DropdownList from '../../components/DropdownList/DropdownList';
import NarrowList from '../../components/NarrowList/NarrowList';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import InputMd from '../../components/InputMd/InputMd';
import TextareaMd from '../../components/TextareaMd/TextareaMd';
import { clearEntity } from '../../model/actions/selectedEntity';
import { errorMessage } from '../../model/actions/notification';
import { showModal, hideModal } from '../../model/actions/modal';
import SingleTask from '../SingleTask/SingleTask';

class SingleProject extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            loadingData: false,
            selectedTasks: [],
            availableTasks: [],
        };
    }

    componentDidMount() {
        this.setupData();
    }

    componentWillReceiveProps(nextProps) {
        this.setupData(nextProps);
    }

    setupData(props = this.props) {
        const { project, tasks } = props;
        const { selectedTasks, availableTasks } = filterTasks(project, tasks);

        this.setState({
            name: project.name || '',
            description: project.description || '',
            loadingData: false,
            selectedTasks,
            availableTasks,
        });
    }

    connectTask(newTask) {
        this.setState({
            selectedTasks: this.state.selectedTasks.concat([newTask]),
            availableTasks: this.state.availableTasks.filter(task => task.id !== newTask.id),
        });
    }

    deleteProject() {
        const { project, deleteProject } = this.props;
        deleteProject(project.id);
    }

    disconnectTask(newTask) {
        this.setState({
            selectedTasks: this.state.selectedTasks.filter(task => task.id !== newTask.id),
            availableTasks: this.state.availableTasks.concat([newTask]),
        });
    }

    submitProject() {
        const { project, updateProject, addNewProject, errorMessage } = this.props;

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
    }

    openTask(task) {
        const { showModal, hideModal } = this.props;
        showModal(<SingleTask
            task={task}
            className='single-task-modal'
            onSave={() => hideModal()}
            onDelete={() => hideModal()}
            onCancel={() => hideModal()}
        />);
    }

    render() {
        const { project, clearEntity } = this.props;
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
                    onClick={this.submitProject.bind(this)}
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
                        onClick={this.openTask.bind(this)}
                        onDelete={this.disconnectTask.bind(this)}
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
                    <DeleteButton onDelete={this.deleteProject.bind(this)} />
                );
            }
            return null;
        };
        return (
            <div className='single-panel'>
                <div className='form-group'>
                    <InputMd
                        type='text'
                        name='name'
                        value={this.state.name}
                        onChange={e => this.setState({
                            name: e.target.value,
                        })}
                        className='flat-input'
                        placeholder='Project name'
                        autoComplete='off'
                        key={`input-md-${project.id}`}
                        data-qa='project-name'
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
                        placeholder='Project description'
                        key={`textarea-md-${project.id}`}
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
                        onSelect={this.connectTask.bind(this)}
                    />
                </div>
                {renderTime()}
                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            {renderSaveButton()}
                            <button
                                className='btn btn-default'
                                disabled={this.state.loadingData}
                                onClick={() => clearEntity(entityConst.ENTITY_PROJECT)}
                                data-qa='project-cancel'
                            >
                                Cancel
                            </button>
                        </span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='pull-right'>
                        {renderDeleteButton()}
                    </div>
                </div>
            </div>
        );
    }
}

SingleProject.propTypes = {
    project: PropTypes.shape({}),
};

SingleProject.defaultProps = {
    project: {},
};

export default connect(
    state => ({
        tasks: state.tasks,
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

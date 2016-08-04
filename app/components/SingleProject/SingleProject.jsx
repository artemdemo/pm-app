import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filterTasks } from '../../utils/tasks';
import { deleteProject, updateProject, addNewProject } from '../../actions/projects';
import { DropdownList } from '../DropdownList/DropdownList';
import { NarrowList } from '../NarrowList/NarrowList';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { clearEntity } from '../../actions/selectedEntity';
import * as entityConst from '../../constants/selectedEntity';

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
            const { updateProject, addNewProject } = this.props;
            const project = this.getProject();
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

        this.connectTask = (newTask) => {
            this.setState({
                selectedTasks: this.state.selectedTasks.concat([newTask]),
                availableTasks: this.state.availableTasks.filter((task) => task.id !== newTask.id),
            });
        };

        this.disconnectTask = (newTask) => {
            this.setState({
                selectedTasks: this.state.selectedTasks.filter((task) => task.id !== newTask.id),
                availableTasks: this.state.availableTasks.concat([newTask]),
            });
        };

        this.deleteProject = () => {
            const project = this.getProject();
            const { deleteProject } = this.props;
            deleteProject(project.id);
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
                <button type='submit'
                        className='btn btn-primary'
                        disabled={this.state.loadingData}>
                    <span>{text}</span>
                </button>
            );
        };
        const renderNarrowList = () => {
            if (this.state.selectedTasks.length > 0) {
                return (
                    <NarrowList list={this.state.selectedTasks}
                                deletable={true}
                                onDelete={this.disconnectTask} />
                );
            }
            return (
                <div className='text-muted'>No tasks selected</div>
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
                    <input type='text'
                           name='name'
                           className='flat-input'
                           placeholder='Project name'
                           value={this.state.name}
                           onChange={(e) => this.setState({
                               name: e.target.value,
                           })}
                           data-qa='project-name' />
                </div>
                <div className='form-group'>
                    <textarea className='flat-input'
                              name='description'
                              rows='3'
                              value={this.state.description}
                              onChange={(e) => this.setState({
                                  description: e.target.value,
                              })}
                              data-qa='project-description'></textarea>
                </div>
                <div className='form-group'>
                    <div className='single-panel__subtitle'>
                        Tasks
                    </div>
                    {renderNarrowList()}
                </div>
                <div className='form-group'>
                    <DropdownList list={this.state.availableTasks}
                                  placeholder='Connect tasks to project'
                                  onSelect={this.connectTask} />
                </div>
                {renderTime()}
                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            {renderSaveButton()}
                            <span className='btn btn-default'
                                  disabled={this.state.loadingData}
                                  onClick={() => clearEntity(entityConst.ENTITY_PROJECT)}
                                  data-qa='project-cancel'>Cancel</span>
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
    project: React.PropTypes.object,
    selectedEntity: React.PropTypes.object,
};

export default connect(
    state => {
        return {
            tasks: state.tasks,
            selectedEntity: state.selectedEntity,
        };
    }, {
        clearEntity,
        deleteProject,
        updateProject,
        addNewProject,
    }
)(SingleProject);

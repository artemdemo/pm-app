import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
import EntityModal from '../../components/EntityModal/EntityModal';
import {
    addProject,
    updateProject,
    deleteProject,
} from '../../model/projects/projectsActions';
import * as location from '../../services/location';
import Project from '../../model/projects/Project';

const getCurrentProject = createSelector(
    props => props.projects.data,
    props => props.params.projectId,
    (projects, projectId) => {
        return projects.find(item => String(item.id) === projectId);
    },
);

class SingleProjectView extends React.PureComponent {
    static getDerivedStateFromProps(props, state) {
        const project = getCurrentProject(props);
        if (project && project !== state.prevProject) {
            return {
                name: project.name || '',
                description: project.description || '',
                prevSingleData: project,
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            prevProject: null,
        };
    }

    submitProject = () => {
        const { updateProject, addProject, params } = this.props;
        const currentProject = getCurrentProject(this.props);
        if (params.projectId === 'new') {
            const project = new Project({
                name: this.state.name,
                description: this.state.description,
            });
            addProject(project);
        } else if (currentProject) {
            const project = new Project({
                ...currentProject,
                name: this.state.name,
                description: this.state.description,
            });
            updateProject(project);
        }
        location.push('/projects');
    };

    deleteProject = () => {
        const { deleteProject } = this.props;
        const currentProject = getCurrentProject(this.props);
        if (currentProject) {
            deleteProject(currentProject.id);
        }
        location.push('/projects');
    };

    render() {
        return (
            <EntityModal>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Project name'
                        onChange={e => this.setState({name: e.target.value})}
                        value={this.state.name}
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        placeholder='Project description'
                        rows='3'
                        onChange={e => this.setState({description: e.target.value})}
                        value={this.state.description}
                    />
                </div>

                <div className='row justify-content-between'>
                    <div className='col-6'>
                        <span className='buttons-group'>
                            <button
                                className='btn btn-primary'
                                onClick={this.submitProject}
                            >
                                Save
                            </button>
                            <Link
                                className='btn btn-light'
                                to={location.wrapUrl('/projects')}
                            >
                                Close
                            </Link>
                        </span>
                    </div>
                    <div className='col-4'>
                        <button
                            className='btn btn-danger'
                            onClick={this.deleteProject}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </EntityModal>
        );
    }
}

export default connect(
    state => ({
        projects: state.projects,
    }), {
        addProject,
        updateProject,
        deleteProject,
    }
)(SingleProjectView);

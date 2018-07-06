import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Translate } from 'react-localize-redux';
import EntityModal from '../../components/EntityModal/EntityModal';
import EntityControllers from '../../components/EntityControllers/EntityControllers';
import Popup from '../../components/Popup/Popup';
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
                prevProject: project,
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

        this.popupRef = React.createRef();
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
        this.popupRef.current.show();
    };

    render() {
        return (
            <Translate>
                {({ translate }) => (
                    <React.Fragment>
                        <EntityModal title={translate('project')}>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder={translate('project-name')}
                                    onChange={e => this.setState({name: e.target.value})}
                                    value={this.state.name}
                                />
                            </div>
                            <div className='form-group'>
                            <textarea
                                className='form-control'
                                placeholder={translate('project-description')}
                                rows='3'
                                onChange={e => this.setState({description: e.target.value})}
                                value={this.state.description}
                            />
                            </div>

                            <EntityControllers
                                onSave={this.submitProject}
                                onClose={() => location.push('/projects')}
                                onDelete={this.deleteProject}
                            />
                        </EntityModal>
                        <Popup
                            title={translate('delete-project')}
                            ref={this.popupRef}
                            buttons={[
                                {
                                    text: translate('cancel'),
                                    className: 'btn btn-light',
                                },
                                {
                                    text: translate('delete'),
                                    className: 'btn btn-primary',
                                    onClick: () => {
                                        const { deleteProject } = this.props;
                                        const currentProject = getCurrentProject(this.props);
                                        if (currentProject) {
                                            deleteProject(currentProject.id);
                                        }
                                        location.push('/projects');
                                    },
                                },
                            ]}
                        >
                            {translate('delete-it-question')}
                        </Popup>
                    </React.Fragment>
                )}
            </Translate>
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

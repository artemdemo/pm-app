import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import ProjectsListItem from './ProjectsListItem';
import { clearEntity, selectProject } from '../../model/selectedEntity/selectedEntityActions';

class ProjectsList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.filterProjects = (filter, projects) => {
            switch (filter) {
                case 'active':
                    return projects.filter(item => item.tasks.length && item.tasks.length > 0);
                case 'empty':
                    return projects.filter(item => !item.tasks.length || item.tasks.length === 0);
                case 'all':
                default:
                    return projects;
            }
        };
    }

    componentWillUnmount() {
        const { clearEntity } = this.props;
        clearEntity(entityConst.ENTITY_PROJECT);
    }

    render() {
        const { projects, selectProject } = this.props;

        return (
            <div>
                <h4>Active</h4>
                <div className='row'>
                    {this.filterProjects('active', projects).map(project => (
                        <div
                            className='col-6 col-md-3'
                            key={`project-${project.id}`}
                        >
                            <ProjectsListItem project={project} />
                        </div>
                    ))}
                </div>
                <h4>Other</h4>
                <div className='row'>
                    {this.filterProjects('empty', projects).map(project => (
                        <div
                            className='col-6 col-md-3'
                            key={`project-${project.id}`}
                        >
                            <ProjectsListItem project={project} />
                        </div>
                    ))}
                </div>
                <button
                    className='btn btn-light'
                    onClick={() => {
                        selectProject({});
                    }}
                    data-qa='new-project'
                >
                    New Project
                </button>
            </div>
        );
    }
}

ProjectsList.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.object),
};

ProjectsList.defaultProps = {
    projects: [],
};

export default connect(
    () => ({}),
    {
        clearEntity,
        selectProject,
    }
)(ProjectsList);

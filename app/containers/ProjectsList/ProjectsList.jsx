import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import ProjectsListItem from './ProjectsListItem';
import { clearEntity, selectProject } from '../../model/selectedEntity/selectedEntityActions';

import './ProjectsList.less';

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
                <div
                    className='projects-list'
                    data-qa='projects-list__active'
                >
                    {this.filterProjects('active', projects).map(project => (
                        <ProjectsListItem project={project} key={`project-${project.id}`} />
                    ))}
                </div>
                <h4>Other</h4>
                <div
                    className='projects-list'
                    data-qa='projects-list__other'
                >
                    {this.filterProjects('empty', projects).map(project => (
                        <ProjectsListItem project={project} key={`project-${project.id}`} />
                    ))}
                </div>
                <button
                    className='btn btn-default'
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

export default connect(
    state => ({
        projects: state.projects,
    }), {
        clearEntity,
        selectProject,
    }
)(ProjectsList);

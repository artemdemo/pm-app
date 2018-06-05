import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ProjectsListItem from './ProjectsListItem';

class ProjectsList extends React.PureComponent {
    filterProjects(filter, projects) {
        switch (filter) {
            case 'active':
                return projects.filter(item => item.tasks.length && item.tasks.length > 0);
            case 'empty':
                return projects.filter(item => !item.tasks.length || item.tasks.length === 0);
            case 'all':
            default:
                return projects;
        }
    }

    renderActive() {
        const { projects } = this.props;
        const activeProjects = this.filterProjects('active', projects);
        if (activeProjects.length > 0) {
            return (
                <div className='form-group'>
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
                </div>
            );
        }
        return null;
    }

    renderEmpty() {
        const { projects } = this.props;
        const emptyProjects = this.filterProjects('empty', projects);
        if (emptyProjects.length > 0) {
            return (
                <div className='form-group'>
                    <h4>Other</h4>
                    <div className='row'>
                        {emptyProjects.map(project => (
                            <div
                                className='col-6 col-md-3'
                                key={`project-${project.id}`}
                            >
                                <ProjectsListItem project={project} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {


        return (
            <ErrorBoundary componentName='ProjectsList'>
                {this.renderActive()}
                {this.renderEmpty()}
            </ErrorBoundary>
        );
    }
}

ProjectsList.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({})),
};

ProjectsList.defaultProps = {
    projects: [],
};

export default ProjectsList;

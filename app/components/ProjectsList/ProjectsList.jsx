import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectsListItem from './ProjectsListItem';

import './ProjectsList.less';

class ProjectsList extends Component {
    constructor(props) {
        super(props);

        this.filterProjects = (filter, projects) => {
            switch (filter) {
                case 'active':
                    return projects.filter((item) => item.tasks.length && item.tasks.length > 0);
                case 'empty':
                    return projects.filter((item) => !item.tasks.length || item.tasks.length === 0);
                case 'all':
                default:
                    return projects;
            }
        }
    }

    addNewProject() {}

    render() {
        const { projects } = this.props;

        return (
            <div>
                <h4>Active</h4>
                <div className='projects-list'>
                    {this.filterProjects('active', projects).map(project => (
                        <ProjectsListItem project={project} key={`project-${project.id}`} />
                    ))}
                </div>
                <h4>Other</h4>
                <div className='projects-list'>
                    {this.filterProjects('empty', projects).map(project => (
                        <ProjectsListItem project={project} key={`project-${project.id}`} />
                    ))}
                </div>
                <button className='btn btn-default' onClick={this.addNewProject}>New Project</button>
            </div>
        );
    }
}

ProjectsList.propTypes = {
    projects: React.PropTypes.arrayOf(React.PropTypes.object)
}

export default connect(
    state => {
        return {
            projects: state.projects
        }
    }
)(ProjectsList);

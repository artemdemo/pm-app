import React from 'react';
import { connect } from 'react-redux';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ProjectsList from '../../containers/ProjectsList/ProjectsList';

import '../list-container.less';

const ProjectsView = (props) => {
    const { projects } = props;
    return (
        <React.Fragment>
            <ErrorBoundary componentName='ProjectsList'>
                <ProjectsList projects={projects.data} />
            </ErrorBoundary>
            {props.children}
        </React.Fragment>
    );
};

export default connect(
    state => ({
        selectedEntity: state.selectedEntity,
        projects: state.projects,
    })
)(ProjectsView);

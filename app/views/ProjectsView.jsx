import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../model/selectedEntity/selectedEntityConst';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import MainMenu from '../containers/MainMenu/MainMenu';
import ProjectsList from '../containers/ProjectsList/ProjectsList';
import SingleProject from '../containers/SingleProject/SingleProject';

import './list-container.less';

const ProjectsView = (props) => {
    const { selectedEntity, projects } = props;
    const selectedProject = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_PROJECT ?
        selectedEntity.entity :
        undefined;
    const classView = classnames({
        'list-container': true,
        'list-container_open-right-panel': !!selectedProject,
    });
    return (
        <div>
            <MainMenu />

            <div className={classView}>
                <div className='list-container__list'>
                    <ErrorBoundary componentName='ProjectsList'>
                        <ProjectsList projects={projects.data} />
                    </ErrorBoundary>
                </div>
                <div className='list-container__panel'>
                    <ErrorBoundary componentName='SingleProject'>
                        <SingleProject project={selectedProject} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default connect(
    state => ({
        selectedEntity: state.selectedEntity,
        projects: state.projects,
    })
)(ProjectsView);

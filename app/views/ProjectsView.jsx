import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../model/constants/selectedEntity';
import MainMenu from '../components/MainMenu/MainMenu';
import ProjectsList from '../components/ProjectsList/ProjectsList';
import SingleProject from '../components/SingleProject/SingleProject';

import './list-container.less';

const ProjectsView = (props) => {
    const { selectedEntity } = props;
    const selectedProject = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_PROJECT ?
        selectedEntity.entity :
        null;
    const classView = classnames({
        'list-container': true,
        'list-container_open-right-panel': !!selectedProject,
    });
    return (
        <div>
            <MainMenu />

            <div className={classView}>
                <div className='list-container__list'>
                    <ProjectsList />
                </div>
                <div className='list-container__panel'>
                    <SingleProject project={selectedProject} />
                </div>
            </div>
        </div>
    );
};

export default connect(
    state => ({
        selectedEntity: state.selectedEntity,
    })
)(ProjectsView);

import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../constants/selectedEntity';
import MainMenu from '../components/MainMenu/MainMenu';
import ProjectsList from '../components/ProjectsList/ProjectsList';
// import SingleProject from '../components/SingleProject/SingleProject';

import './list-container.less';

class ProjectsView extends Component {
    render() {
        const { selectedEntity } = this.props;
        const selectedTask = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_PROJECT ?
                             selectedEntity.entity :
                             null;
        const classView = classnames({
            'list-container': true,
            'list-container_open-right-panel': !!selectedTask,
        });
        return (
            <div>
                <MainMenu />

                <div className={classView}>
                    <div className='list-container__list'>
                        <ProjectsList />
                    </div>
                    <div className='list-container__panel'>

                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            selectedEntity: state.selectedEntity,
        };
    }
)(ProjectsView);

import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../constants/selectedEntity';
import MainMenu from '../components/MainMenu/MainMenu';
import TasksList from '../components/TasksList/TasksList';
import SingleTask from '../components/SingleTask/SingleTask';
import { clearEntity } from '../actions/selectedEntity';

import './list-container.less';

class TasksView extends Component {
    render() {
        const { selectedEntity, clearEntity } = this.props;
        const selectedTask = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_TASK ?
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
                        <TasksList />
                    </div>
                    <div className='list-container__panel'>
                        <SingleTask task={selectedTask}
                                    onSave={() => clearEntity(entityConst.ENTITY_TASK)}
                                    onCancel={() => clearEntity(entityConst.ENTITY_TASK)}
                                    onDelete={() => clearEntity(entityConst.ENTITY_TASK)}
                                    className='single-panel' />
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
    }, {
        clearEntity,
    }
)(TasksView);

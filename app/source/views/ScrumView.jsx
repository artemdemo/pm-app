import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../model/selectedEntity/selectedEntityConst';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import MainMenu from '../containers/MainMenu/MainMenu';
import BoardsList from '../containers/BoardsList/BoardsList';
import SingleTask from '../containers/SingleTask/SingleTask';
import { clearEntity } from '../model/selectedEntity/selectedEntityActions';

const ScrumView = (props) => {
    const { selectedEntity, clearEntity } = props;
    const selectedTask = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_TASK ?
        selectedEntity.entity :
        undefined;
    const classView = classnames({
        'list-container': true,
        'list-container_open-right-panel': !!selectedTask,
    });
    return (
        <div>
            <MainMenu />

            <div className={classView}>
                <div className='list-container__list'>
                    <ErrorBoundary componentName='BoardsList'>
                        <BoardsList />
                    </ErrorBoundary>
                </div>
                <div className='list-container__panel'>
                    <ErrorBoundary componentName='SingleTask'>
                        <SingleTask
                            task={selectedTask}
                            onSave={() => clearEntity(entityConst.ENTITY_TASK)}
                            onCancel={() => clearEntity(entityConst.ENTITY_TASK)}
                            onDelete={() => clearEntity(entityConst.ENTITY_TASK)}
                            className='single-panel'
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default connect(
    state => ({
        selectedEntity: state.selectedEntity,
    }), {
        clearEntity,
    }
)(ScrumView);

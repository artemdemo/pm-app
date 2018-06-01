import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import TasksList from '../../containers/TasksList/TasksList';
import SingleTask from '../../containers/SingleTask/SingleTask';
import { clearEntity } from '../../model/selectedEntity/selectedEntityActions';

import '../list-container.less';

const TasksView = (props) => {
    const { selectedEntity } = props;
    const selectedTask = !!selectedEntity && selectedEntity.type === entityConst.ENTITY_TASK ?
        selectedEntity.entity :
        undefined;
    const classView = classnames({
        'list-container': true,
        'list-container_open-right-panel': !!selectedTask,
    });
    return (
        <div className={classView}>
            <ErrorBoundary componentName='TasksList'>
                <TasksList />
            </ErrorBoundary>
            {props.children}
        </div>
    );
};

export default connect(
    state => ({
        selectedEntity: state.selectedEntity,
    }), {
        clearEntity,
    }
)(TasksView);

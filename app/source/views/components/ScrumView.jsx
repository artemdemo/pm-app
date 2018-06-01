import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import BoardsList from '../../containers/BoardsList/BoardsList';
import { clearEntity } from '../../model/selectedEntity/selectedEntityActions';

import '../list-container.less';

const ScrumView = (props) => {
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
            <div className='list-container__list'>
                <ErrorBoundary componentName='BoardsList'>
                    <BoardsList />
                </ErrorBoundary>
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

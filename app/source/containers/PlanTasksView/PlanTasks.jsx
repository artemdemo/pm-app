import React from 'react';
import PropTypes from 'prop-types';
import { DragItemsContainer } from '../../components/DragNDrop/DragItemsContainer';
import { DragItem } from '../../components/DragNDrop/DragItem';

import './PlanTasks.less';

class PlanTasks extends React.PureComponent {
    dragStopped = (itemData) => {
        const { dragStopped } = this.props;
        dragStopped && dragStopped(itemData);
    };

    render() {
        const { tasks, name } = this.props;
        return (
            <DragItemsContainer
                className='plan-tasks'
                container={name}
            >
                {tasks.map(task => (
                    <DragItem
                        className='plan-tasks-item'
                        item={task.id}
                        key={`plan-tasks-item-${task.id}`}
                        dragStopped={this.dragStopped}
                        placeholderClass='plan-tasks-item-placeholder'
                    >
                        {task.name}
                    </DragItem>
                ))}
            </DragItemsContainer>
        );
    }
}

PlanTasks.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({})),
    name: PropTypes.string,
    dragStopped: PropTypes.func,
};

PlanTasks.defaultProps = {
    tasks: [],
    name: '',
    dragStopped: null,
};

export default PlanTasks;

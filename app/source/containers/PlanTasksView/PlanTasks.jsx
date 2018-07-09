import React from 'react';
import PropTypes from 'prop-types';

class PlanTasks extends React.PureComponent {
    render() {
        const { tasks } = this.props;
        return (
            <div>
                {tasks.map(task => (
                    <div key={`on-board-tasks__item-${task.id}`}>{task.name}</div>
                ))}
            </div>
        );
    }
}

PlanTasks.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({})),
};

export default PlanTasks;

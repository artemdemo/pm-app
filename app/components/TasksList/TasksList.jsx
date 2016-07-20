import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as entityConst from '../../constants/selectedEntity';
import { RadioMenu } from '../RadioMenu/RadioMenu';
import TasksListItem from './TasksListItem';
import { clearEntity } from '../../actions/selectedEntity';

import './TasksList.less';

class TasksList extends Component {
    componentWillUnmount() {
        const { clearEntity } = this.props;
        clearEntity(entityConst.ENTITY_TASK);
    }

    render() {
        const { tasks } = this.props;
        const listMenu = [
            { id: 1, name: 'All'},
            { id: 2, name: 'Active' },
            { id: 3, name: 'Completed' },
        ];
        const newTask = {
            name: '',
            description: ''
        }
        return (
            <div>
                <RadioMenu list={listMenu} />
                <div className='tasks-list'>
                    <TasksListItem task={newTask} key={`task-0`} />
                    {tasks.map(task => (
                        <TasksListItem task={task} key={`task-${task.id}`} />
                    ))}
                </div>
            </div>
        );
    }
}

TasksList.propTypes = {
    tasks: React.PropTypes.arrayOf(React.PropTypes.object)
}

export default connect(
    state => {
        return {
            tasks: state.tasks,
        }
    }, {
        clearEntity,
    }
)(TasksList);

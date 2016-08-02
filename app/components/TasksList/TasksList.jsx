import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as entityConst from '../../constants/selectedEntity';
import { RadioMenu } from '../RadioMenu/RadioMenu';
import TasksListItem from './TasksListItem';
import { clearEntity } from '../../actions/selectedEntity';

import './TasksList.less';

class TasksList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: props.tasks,
        };

        this.listMenu = [
            { id: 1, name: 'All' },
            { id: 2, name: 'Active' },
            { id: 3, name: 'Completed' },
        ];

        this.sortingMenuItem = this.listMenu[0];

        this.selectItem = (item) => {
            this.sortingMenuItem = item;
            this.setState({
                tasks: this.filterTasks(this.props.tasks, this.sortingMenuItem),
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tasks: this.filterTasks(nextProps.tasks, this.sortingMenuItem),
        });
    }

    componentWillUnmount() {
        const { clearEntity } = this.props;
        clearEntity(entityConst.ENTITY_TASK);
    }

    filterTasks(tasks, sortItem) {
        return tasks.filter((item) => {
            switch (sortItem.id) {
                case 2: // active
                    return item.done === false;
                case 3: // completed
                    return item.done === true;
                default: // all
                    return true;
            }
        });
    }

    render() {
        const newTask = {
            name: '',
            description: '',
        };
        return (
            <div>
                <RadioMenu list={this.listMenu} onSelect={this.selectItem} />
                <div className='tasks-list'>
                    <TasksListItem task={newTask} key='task-0' />
                    {this.state.tasks.map(task => (
                        <TasksListItem task={task} key={`task-${task.id}`} />
                    ))}
                </div>
            </div>
        );
    }
}

TasksList.propTypes = {
    tasks: React.PropTypes.arrayOf(React.PropTypes.object),
};

export default connect(
    state => {
        return {
            tasks: state.tasks,
        };
    }, {
        clearEntity,
    }
)(TasksList);

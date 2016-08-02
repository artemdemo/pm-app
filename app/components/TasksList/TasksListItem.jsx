import React, { Component } from 'react';
import classnames from 'classnames';
import * as entityConst from '../../constants/selectedEntity';
import { connect } from 'react-redux';
import { filterProjects } from '../../utils/tasks';
import { addNewTask } from '../../actions/tasks';
import { OkCircle } from '../OkCircle/OkCircle';
import { LabelsList } from '../LabelsList/LabelsList';
import { selectTask, clearEntity } from '../../actions/selectedEntity';

import './TasksListItem.less';

class TasksListItem extends Component {
    constructor(props) {
        super(props);
        this.isLoading = false;

        this.toggleDone = () => {};

        this.createNewTask = (e) => {
            const { addNewTask } = this.props;
            e.preventDefault();
            addNewTask({
                name: this.refs.nameInput.value,
                done: false,
            });

            // ToDo: input should be cleaned only after task was successfully added
            this.refs.nameInput.value = '';
        };
    }

    render() {
        const { task, projects, selectTask, clearEntity } = this.props;
        const itemClass = classnames({
            'tasks-list-item__text': true,
            'tasks-list-item__text_done': task.done,
        });

        const { selectedProjects } = filterProjects(task, projects);

        const renderTaskName = () => {
            if (task.id) {
                return (
                    <span className={itemClass}>
                        {task.name}
                    </span>
                );
            }

            return (
                <form onSubmit={this.createNewTask}>
                    <input className='tasks-list-item__name-input'
                           ref='nameInput'
                           placeholder='New task...' />
                </form>
            );
        };

        return (
            <div className='tasks-list-item'>
                <div className='tasks-list-item__cell
                                tasks-list-item__cell_icon'
                                onClick={() => task.id && this.toggleDone()}>
                    <OkCircle doneStatus={task.done} loading={this.isLoading} />
                </div>
                <div className='tasks-list-item__cell'
                     onClick={() => {
                         if (task.id) {
                             selectTask(task);
                         } else {
                             clearEntity(entityConst.ENTITY_TASK);
                         }
                     }}>
                    {renderTaskName()}
                </div>
                <div className='tasks-list-item__cell
                                tasks-list-item__cell_labels'>
                    <LabelsList list={selectedProjects} limit={1} />
                </div>
                <div className='tasks-list-item__cell
                                tasks-list-item__cell_icon'>
                </div>
            </div>
        );
    }
}

TasksListItem.propTypes = {
    task: React.PropTypes.object,
    projects: React.PropTypes.arrayOf(React.PropTypes.object),
};

export default connect(
    state => {
        return {
            projects: state.projects,
        };
    },
    {
        selectTask,
        clearEntity,
        addNewTask,
    }
)(TasksListItem);

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import _isNumber from 'lodash/isNumber';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import { filterProjects } from '../../utils/tasks';
import emoji from '../../utils/emoji/emoji';
import { addNewTask } from '../../model/tasks/tasksActions';
import OkCircle from '../../components/OkCircle/OkCircle';
import LabelsList from '../../components/LabelsList/LabelsList';
import { selectTask, clearEntity } from '../../model/selectedEntity/selectedEntityActions';
import { errorMessage } from '../../model/notification/notificationActions';

import './TasksListItem.less';

class TasksListItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };
    }

    changeName(e) {
        this.setState({
            name: e.target.value,
        });
    }

    toggleDone() {}

    taskClick() {
        const { task, selectTask, clearEntity } = this.props;
        if (task.id) {
            selectTask(task);
        } else {
            clearEntity(entityConst.ENTITY_TASK);
        }
    }

    createNewTask(e) {
        const { addNewTask, errorMessage, projectId } = this.props;
        const newTaskName = this.state.name;
        e.preventDefault();

        if (newTaskName === '') {
            errorMessage('Name can\'t be empty');
            return;
        }

        const projects = _isNumber(projectId) ? [Number(projectId)] : [];

        addNewTask({
            name: newTaskName,
            done: false,
            projects,
        });

        this.setState({
            name: '',
        });
    }

    render() {
        const { task, projects } = this.props;
        const itemClass = classnames({
            'tasks-list-item__text': true,
            'tasks-list-item__text_done': task.done,
        });

        const { selectedProjects } = filterProjects(task, projects.data);

        const renderTaskName = () => {
            if (task.id) {
                return (
                    <span className={itemClass}>
                        {emoji(task.name)}
                    </span>
                );
            }

            return (
                <form onSubmit={this.createNewTask.bind(this)}>
                    <input
                        className='tasks-list-item__name-input'
                        placeholder='New task...'
                        value={this.state.name}
                        onChange={this.changeName.bind(this)}
                        data-qa='new-task-input'
                    />
                </form>
            );
        };

        return (
            <div className='tasks-list-item'>
                <div
                    className='tasks-list-item__cell
                               tasks-list-item__cell_icon'
                    onClick={this.toggleDone.bind(this)}
                >
                    <OkCircle doneStatus={task.done} />
                </div>
                <div
                    className='tasks-list-item__cell'
                    onClick={this.taskClick.bind(this)}
                >
                    {renderTaskName()}
                </div>
                <div className='tasks-list-item__cell
                                tasks-list-item__cell_labels'
                >
                    <LabelsList list={selectedProjects} limit={1} />
                </div>
                <div className='tasks-list-item__cell
                                tasks-list-item__cell_icon' />
            </div>
        );
    }
}

TasksListItem.propTypes = {
    task: PropTypes.shape({}),
    projectId: PropTypes.string,
};

export default connect(
    state => ({
        projects: state.projects,
    }),
    {
        selectTask,
        clearEntity,
        addNewTask,
        errorMessage,
    }
)(TasksListItem);

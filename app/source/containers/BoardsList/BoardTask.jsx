import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { filterProjects } from '../../utils/tasks';
import Icon from '../../components/Icon/Icon';
import LabelsList from '../../components/LabelsList/LabelsList';
import * as taskConst from '../../model/tasks/tasksConst';
import { selectTask } from '../../model/selectedEntity/selectedEntityActions';

import './BoardTask.less';

class BoardTask extends React.PureComponent {
    openTask() {
        const { task, selectTask } = this.props;
        selectTask(task);
    }

    render() {
        const { task, projects, settings } = this.props;
        const { selectedProjects } = filterProjects(task, projects.data);

        const renderSP = () => {
            if (task.sp > 0) {
                return (
                    <div className='board-task-description__item'>
                        SP: {task.sp}
                    </div>
                );
            }
            return null;
        };

        const renderDue = () => {
            if (task.due && task.due !== '') {
                return (
                    <div className='board-task-description__item'>
                        <Icon name='calendar' />
                        {moment(task.due, taskConst.DUE_BASE_TIME_FORMAT).format('MMM, D')}
                    </div>
                );
            }
            return null;
        };

        const renderPriority = () => {
            const { priority } = settings;
            const priorityId = Number(task.priority);

            // eslint-disable-next-line
            if (priority && priorityId === priorityId && priorityId > -1) {
                let selectedPriority;
                for (let i = 0, len = priority.length; i < len; i++) {
                    if (priorityId === Number(priority[i].id)) {
                        selectedPriority = priority[i];
                    }
                }
                return (
                    <div className='board-task-description__item'>
                        <Icon name='exclamation-sign' />
                        {selectedPriority && selectedPriority.value}
                    </div>
                );
            }
            return null;
        };

        return (
            <div onClick={this.openTask.bind(this)}>
                <div className='board-task__menu-icon'>
                    <Icon name='option-vertical' />
                </div>
                {task.name}
                <div className='board-task-description
                                text-muted'>
                    {renderSP()}
                    {renderDue()}
                    {renderPriority()}
                </div>
                <div className='board-task__labels-list'>
                    <LabelsList
                        list={selectedProjects}
                        delitable={false}
                    />
                </div>
            </div>
        );
    }
}

BoardTask.propTypes = {
    task: PropTypes.shape({}),
};

BoardTask.defaultProps = {
    task: {},
};

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
        settings: state.settings,
    }), {
        selectTask,
    }
)(BoardTask);
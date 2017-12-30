import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import emoji from '../../utils/emoji/emoji';
import { filterProjects } from '../../utils/tasks';
import { LabelsList } from '../LabelsList/LabelsList';
import * as taskConst from '../../model/constants/tasks';
import { selectTask } from '../../model/actions/selectedEntity';

import './BoardTask.less';

class BoardTask extends React.PureComponent {
    constructor(props) {
        super(props);

        this.openTask = () => {
            const { task, selectTask } = this.props;
            selectTask(task);
        };
    }

    render() {
        const { task, projects, settings } = this.props;
        const { selectedProjects } = filterProjects(task, projects);

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
                        <span className='glyphicon glyphicon-calendar' />
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
                        <span className='glyphicon glyphicon-exclamation-sign' />
                        {selectedPriority && selectedPriority.value}
                    </div>
                );
            }
            return null;
        };

        return (
            <div onClick={this.openTask}>
                <div className='board-task__menu-icon'>
                    <span
                        className='glyphicon glyphicon-option-vertical'
                        aria-hidden='true'
                    />
                </div>
                {emoji(task.name)}
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

export default connect(
    state => ({
        tasks: state.tasks,
        projects: state.projects,
        settings: state.settings,
    }), {
        selectTask,
    }
)(BoardTask);

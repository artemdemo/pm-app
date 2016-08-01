import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { filterProjects } from '../../utils/tasks';
import { LabelsList } from '../LabelsList/LabelsList';
import { setDraggedTask, dropDraggedTask } from '../../actions/draggedTask';

import './BoardTask.less';

class BoardTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholder: false,
        };

        this.dropPlaceholderTimeoutId = null;

        this.dragStart = (e) => {
            const { task, setDraggedTask } = this.props;

            // dragged task can't be set right after dragging started,
            // case it will trigger "display: none;" style and as a result it will stop dragging from happening
            setTimeout(() => {
                setDraggedTask(task);
            }, 50);

            e.dataTransfer.effectAllowed = 'move';

            // Firefox requires calling dataTransfer.setData
            // for the drag to properly work
            e.dataTransfer.setData('text/html', e.currentTarget);
        };

        this.dragEnd = () => {
            const { dropDraggedTask } = this.props;
            dropDraggedTask();
        };

        this.dragOver = (e) => {
            e.stopPropagation();
            clearTimeout(this.dropPlaceholderTimeoutId);
            this.dropPlaceholderTimeoutId = setTimeout(() => {
                this.setState({
                    renderPlaceholder: false,
                });
            }, 100);
            if (e.target.className.indexOf('board-task_placeholder') > -1) return;
            const relY = e.clientY - e.target.offsetTop;
            const height = e.target.offsetHeight / 2;

            this.setState({
                renderPlaceholder: relY > height ? 'after' : 'before',
            });
        };
    }

    render() {
        const { task, projects, draggedTask } = this.props;
        const { selectedProjects } = filterProjects(task, projects);
        const taskWrapClass = classnames({
            'board-task-wrap': true,
            'board-task-wrap_is-dragged': draggedTask.task && draggedTask.task.id === task.id,
        });

        // `position` can be `before` or `after`
        const renderPlaceholder = (position) => {
            if (this.state.renderPlaceholder === position) {
                const placeholderClass = classnames({
                    'board-task_placeholder': true,
                    [`board-task_placeholder__${position}`]: true,
                });
                return (
                    <div className={placeholderClass}></div>
                );
            }
            return null;
        };
        return (
            <div className={taskWrapClass}
                 onDragOver={this.dragOver}>
                {renderPlaceholder('before')}
                <div className='board-task'
                     draggable='true'
                     onDragOver={this.dragOver}
                     onDragStart={this.dragStart}
                     onDragEnd={this.dragEnd}>
                    <div className='board-task__menu-icon'>
                        <span className='glyphicon glyphicon-option-vertical'
                              aria-hidden='true'></span>
                    </div>
                    {task.name}
                    <div className='board-task__labels-list'>
                        <LabelsList list={selectedProjects}
                                    delitable={false} />
                    </div>
                </div>
                {renderPlaceholder('after')}
            </div>
        );
    }
}

BoardTask.proptypes = {
    task: React.PropTypes.object,
};

export default connect(
    state => {
        return {
            projects: state.projects,
            draggedTask: state.draggedTask,
        };
    }, {
        setDraggedTask,
        dropDraggedTask,
    }
)(BoardTask);

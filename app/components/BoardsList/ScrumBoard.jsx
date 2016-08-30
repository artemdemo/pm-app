import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'underscore';
import BoardTask from './BoardTask';
import { showModal, hideModal } from '../../actions/modal';
import { setDraggedTaskDropPosition } from '../../actions/draggedTask';
import SingleBoard from '../SingleBoard/SingleBoard';
import { sortByIdPositionScrum } from '../../utils/tasks';
import emoji from '../../utils/emoji/emoji';

import './ScrumBoard.less';

class ScrumBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            renderPlaceholder: false,
        };

        this.dropPlaceholderTimeoutId = null;

        const updatePlaceholderState = _.throttle(() => {
            clearTimeout(this.dropPlaceholderTimeoutId);
            this.dropPlaceholderTimeoutId = setTimeout(() => {
                this.setState({
                    renderPlaceholder: false,
                });
            }, 70);

            this.setState({
                renderPlaceholder: 'before', //position,
            });
        }, 70);

        this.editBoard = () => {
            const { showModal, board, hideModal } = this.props;
            showModal(<SingleBoard board={board}
                                   className='single-board'
                                   onSave={() => hideModal()}
                                   onDelete={() => hideModal()}
                                   onCancel={() => hideModal()} />);
        };

        const { setDraggedTaskDropPosition, tasks, board } = this.props;
        const _setDraggedTaskDropPosition = _.debounce(setDraggedTaskDropPosition, 20);

        this.filterSelectedTasks = (tasks, board) => {
            this.selectedTasks = tasks
                .filter(task => task.board_id === board.id)
                .sort(sortByIdPositionScrum);
        };
        this.filterSelectedTasks(tasks, board);

        this.dragOver = (e) => {
            if (this.selectedTasks.length === 0) {
                const { board } = this.props;
                const relY = e.clientY - e.target.offsetTop;
                const height = e.target.offsetHeight / 2;
                const position = relY > height ? 'after' : 'before';
                _setDraggedTaskDropPosition(null, position, board.id);

                updatePlaceholderState(position);
            }
        };
    }

    componentWillReceiveProps(newProps) {
        const { tasks, board } = newProps;
        this.filterSelectedTasks(tasks, board);
    }

    render() {
        const { board } = this.props;

        // `position` can be `before` or `after`
        const renderPlaceholder = (position) => {
            if (this.state.renderPlaceholder === position && this.selectedTasks.length === 0) {
                const placeholderClass = classnames({
                    'scrum-board_placeholder': true,
                    [`scrum-board_placeholder__${position}`]: true,
                });
                return (
                    <div className={placeholderClass}></div>
                );
            }
            return null;
        };

        return (
            <div className='scrum-board'
                 onDragOver={this.dragOver}>
                <div className='board__title'>
                    <div className='board__name'>{emoji(board.title)}</div>
                    <div className='board__edit-board'
                         onClick={this.editBoard}>
                        <span className='glyphicon glyphicon-pencil'></span>
                    </div>
                </div>
                <div className='board-tasks'>
                    {renderPlaceholder('before')}
                    {this.selectedTasks.map(task => {
                        return (
                            <BoardTask task={task} key={`board-task-${task.id}`} />
                        );
                    })}
                    {renderPlaceholder('after')}
                </div>
            </div>
        );
    }
}

ScrumBoard.propTypes = {
    board: React.PropTypes.object,
};

export default connect(
    state => {
        return {
            tasks: state.tasks,
        };
    }, {
        showModal,
        hideModal,
        setDraggedTaskDropPosition,
    }
)(ScrumBoard);

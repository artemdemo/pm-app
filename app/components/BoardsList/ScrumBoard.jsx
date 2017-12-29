import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BoardTask from './BoardTask';
import SingleBoard from '../SingleBoard/SingleBoard';
import { DragItemsContainer } from '../DragNDrop/DragItemsContainer';
import { DragItem } from '../DragNDrop/DragItem';
import { showModal, hideModal } from '../../model/actions/modal';
import { sortByIdPositionScrum } from '../../utils/tasks';
import { updateDraggedTaskPosition } from '../../model/actions/tasks';
import emoji from '../../utils/emoji/emoji';

import './ScrumBoard.less';

class ScrumBoard extends Component {
    constructor(props) {
        super(props);

        this.editBoard = () => {
            const { showModal, board, hideModal } = this.props;
            showModal(<SingleBoard
                board={board}
                className='single-board'
                onSave={() => hideModal()}
                onDelete={() => hideModal()}
                onCancel={() => hideModal()}
            />);
        };

        const { tasks, board } = this.props;

        this.filterSelectedTasks = (tasks, board) => {
            this.selectedTasks = tasks
                .filter(task => task.board_id === board.id)
                .sort(sortByIdPositionScrum);
        };
        this.filterSelectedTasks(tasks, board);

        this.dragStopped = (task, itemData) => {
            const { updateDraggedTaskPosition } = this.props;
            updateDraggedTaskPosition(task, itemData.container, itemData.nearItem, itemData.position);
        };
    }

    componentWillReceiveProps(newProps) {
        const { tasks, board } = newProps;
        this.filterSelectedTasks(tasks, board);
    }

    render() {
        const { board } = this.props;

        return (
            <div className='scrum-board'>
                <div className='board__title'>
                    <div className='board__name'>{emoji(board.title)}</div>
                    <div
                        className='board__edit-board'
                        onClick={this.editBoard}
                    >
                        <span className='glyphicon glyphicon-pencil' />
                    </div>
                </div>
                <DragItemsContainer className='board-tasks'
                    container={board.id}>
                    {this.selectedTasks.map(task => (
                        <DragItem
                            className='board-task'
                            key={`task-${task.id}`}
                            item={task.id}
                            dragStopped={(event, itemData) => this.dragStopped(task, itemData)}
                        >
                            <BoardTask task={task} />
                        </DragItem>
                    ))}
                </DragItemsContainer>
            </div>
        );
    }
}

ScrumBoard.propTypes = {
    board: PropTypes.shape({}),
};

export default connect(
    state => ({
        tasks: state.tasks,
    }), {
        showModal,
        hideModal,
        updateDraggedTaskPosition,
    }
)(ScrumBoard);

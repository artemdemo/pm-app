import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BoardTask from './BoardTask';
import SingleBoard from '../SingleBoard/SingleBoard';
import { DragItemsContainer } from '../../components/DragNDrop/DragItemsContainer';
import { DragItem } from '../../components/DragNDrop/DragItem';
import { showModal, hideModal } from '../../model/modal/modalActions';
import { sortByIdPositionScrum } from '../../utils/tasks';
import { updateDraggedTaskPosition } from '../../model/tasks/tasksActions';
import Icon from '../../components/Icon/Icon';

import './ScrumBoard.less';

class ScrumBoard extends React.PureComponent {
    constructor(props) {
        super(props);

        this.selectedTasks = [];
    }

    componentWillMount() {
        const { tasks, board } = this.props;
        this.filterSelectedTasks(tasks.data, board);
    }

    componentWillReceiveProps(newProps) {
        const { tasks, board } = newProps;
        this.filterSelectedTasks(tasks.data, board);
    }

    filterSelectedTasks(tasks, board) {
        this.selectedTasks = tasks
            .filter(task => task.board_id === board.id)
            .sort(sortByIdPositionScrum);
    }

    dragStopped(itemData) {
        const { tasks, updateDraggedTaskPosition } = this.props;

        // ToDo: `itemData.item` should be `itemData.itemId` or something like that
        const task = tasks.data.find(_ => _.id === itemData.item);
        updateDraggedTaskPosition(task, itemData.container, itemData.nearItem, itemData.position);
    }

    editBoard() {
        const { showModal, board, hideModal } = this.props;
        showModal(<SingleBoard
            board={board}
            className='single-board'
            onSave={() => hideModal()}
            onDelete={() => hideModal()}
            onCancel={() => hideModal()}
        />);
    }

    render() {
        const { board } = this.props;

        return (
            <div className='scrum-board'>
                <div className='board__title'>
                    <div className='board__name'>{board.title}</div>
                    <div
                        className='board__edit-board'
                        onClick={this.editBoard.bind(this)}
                    >
                        <Icon name='pencil' />
                    </div>
                </div>
                <DragItemsContainer
                    className='board-tasks'
                    container={board.id}
                >
                    {this.selectedTasks.map(task => (
                        <DragItem
                            className='board-task'
                            key={`task-${task.id}`}
                            item={task.id}
                            dragStopped={this.dragStopped.bind(this)}
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

ScrumBoard.defaultProps = {
    board: {},
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
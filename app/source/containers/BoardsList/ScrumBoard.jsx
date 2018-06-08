import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BoardTask from './BoardTask';
import BoardMenu, { menuItemsMap } from '../SingleBoard/BoardMenu';
import { DragItemsContainer } from '../../components/DragNDrop/DragItemsContainer';
import { DragItem } from '../../components/DragNDrop/DragItem';
import { sortByIdPositionScrum } from '../../utils/tasks';
import { updateTaskPosition } from '../../model/tasks/tasksActions';

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
        const { tasks, updateTaskPosition } = this.props;

        // ToDo: `itemData.item` should be `itemData.itemId` or something like that
        const task = tasks.data.find(_ => _.id === itemData.item);
        updateTaskPosition(task, itemData.container, itemData.nearItem, itemData.position);
    }

    menuClick = (itemName) => {
        switch (itemName) {
            case menuItemsMap.MOVE_LEFT:
            case menuItemsMap.MOVE_RIGHT:
            case menuItemsMap.EDIT:
        }
    };

    render() {
        const { board, utmostLeft, utmostRight } = this.props;

        return (
            <div className='scrum-board'>
                <div className='board-title'>
                    <div className='board-title__menu'>
                        <BoardMenu
                            onClick={this.menuClick}
                            disableLeft={utmostLeft}
                            disableRight={utmostRight}
                        />
                    </div>
                    <div className='board-title__name'>{board.title}</div>
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
    utmostLeft: PropTypes.bool,
    utmostRight: PropTypes.bool,
};

ScrumBoard.defaultProps = {
    board: {},
    utmostLeft: false,
    utmostRight: false,
};

export default connect(
    state => ({
        tasks: state.tasks,
    }), {
        updateTaskPosition,
    }
)(ScrumBoard);

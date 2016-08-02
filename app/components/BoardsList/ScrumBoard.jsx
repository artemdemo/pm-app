import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filterTasks, sortByIdPositionScrum } from '../../utils/tasks';
import BoardTask from './BoardTask';

import './ScrumBoard.less';

class ScrumBoard extends Component {
    constructor(props) {
        super(props);

        this.editBoard = () => {
            console.log('Edit board');
        };
    }

    render() {
        const { board, tasks } = this.props;
        const { selectedTasks } = filterTasks(board, tasks);
        selectedTasks.sort(sortByIdPositionScrum);
        return (
            <div className='scrum-board'>
                <div className='board__title'>
                    <div className='board__name'>{board.title}</div>
                    <div className='board__edit-board'
                         onClick={this.editBoard}>
                        <span className='glyphicon glyphicon-pencil'></span>
                    </div>
                </div>
                <div className='board-tasks'>
                    {selectedTasks.map(task => {
                        return (
                            <BoardTask task={task} key={`board-task-${task.id}`} />
                        );
                    })}
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
    }
)(ScrumBoard);

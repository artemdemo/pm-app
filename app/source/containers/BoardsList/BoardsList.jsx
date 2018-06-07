import React from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';

import './BoardsList.less';

class BoardsList extends React.PureComponent {
    addNewBoard = () => {};

    render() {
        const { boards } = this.props;
        return (
            <div>
                <div className='boards-list'>
                    {boards.data.map(board => (
                        <ScrumBoard board={board} key={`board-${board.id}`} />
                    ))}
                </div>
                <button
                    className='btn btn-light'
                    onClick={this.addNewBoard}
                    data-qa='new-board'
                >
                    New Board
                </button>
            </div>
        );
    }
}

export default connect(
    state => ({
        boards: state.boards,
    })
)(BoardsList);

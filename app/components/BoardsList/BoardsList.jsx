import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';

import './BoardsList.less';

class BoardsList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { boards } = this.props;
        return (
            <div>
                <div className='boards-list'>
                    {boards.map(board => (
                        <ScrumBoard board={board} key={`board-${board.id}`} />
                    ))}
                </div>
                <button className='btn btn-default'
                        onClick={() => {
                            console.log('Add new board');
                        }}
                        data-qa='add-new-board'>
                    New Board
                </button>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            boards: state.boards
        }
    }
)(BoardsList);
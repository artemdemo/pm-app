import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';
import * as entityConst from '../../constants/selectedEntity';
import { clearEntity } from '../../actions/selectedEntity';

import './BoardsList.less';

class BoardsList extends Component {
    componentWillUnmount() {
        const { clearEntity } = this.props;
        clearEntity(entityConst.ENTITY_TASK);
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
            boards: state.boards,
        };
    }, {
        clearEntity,
    }
)(BoardsList);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';
import * as entityConst from '../../constants/selectedEntity';
import { clearEntity } from '../../actions/selectedEntity';
import { showPopup } from '../../actions/popup';
import SingleBoard from '../SingleBoard/SingleBoard';

import './BoardsList.less';

class BoardsList extends Component {
    constructor(props) {
        super(props);

        this.addNewBoard = () => {
            const { showPopup } = this.props;
            showPopup(<SingleBoard />);
        };
    }

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
                        onClick={this.addNewBoard}
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
        showPopup,
    }
)(BoardsList);

import React from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';
import { showModal, hideModal } from '../../model/modal/modalActions';
import SingleBoard from '../SingleBoard/SingleBoard';

import './BoardsList.less';

class BoardsList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.addNewBoard = () => {
            const { showModal, hideModal } = this.props;
            showModal(<SingleBoard
                className='single-board'
                onSave={() => hideModal()}
                onDelete={() => hideModal()}
                onCancel={() => hideModal()}
            />);
        };
    }

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
    }), {
        showModal,
        hideModal,
    }
)(BoardsList);

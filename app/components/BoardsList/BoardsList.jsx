import React from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';
import * as entityConst from '../../model/constants/selectedEntity';
import { clearEntity } from '../../model/actions/selectedEntity';
import { showModal, hideModal } from '../../model/actions/modal';
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
                <button
                    className='btn btn-default'
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
        clearEntity,
        showModal,
        hideModal,
    }
)(BoardsList);

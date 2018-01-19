import React from 'react';
import { connect } from 'react-redux';
import ScrumBoard from './ScrumBoard';
import * as entityConst from '../../model/selectedEntity/selectedEntityConst';
import { clearEntity } from '../../model/selectedEntity/selectedEntityActions';
import { loadBoards } from '../../model/boards/boardsActions';
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

    componentWillReceiveProps(nextProps) {
        const { loadBoards } = this.props;

        // After updating single board I request all list, since they whole order could change
        if (this.props.boards.updating === true &&
            nextProps.boards.updating === false &&
            !nextProps.boards.updatingError) {
            loadBoards();
        }
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
                    {boards.data.map(board => (
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
        loadBoards,
    }
)(BoardsList);

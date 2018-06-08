import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';
import {
    addBoard,
} from '../../model/boards/boardsActions';
import EntityModal from '../../components/EntityModal/EntityModal';

const getCurrentBoard = createSelector(
    props => props.boards.data,
    props => props.params.boardId,
    (boards, boardId) => {
        return boards.find(item => String(item.id) === boardId);
    },
);

class SingleBoardView extends React.PureComponent {
    static getDerivedStateFromProps(props, state) {
        const board = getCurrentBoard(props);
        if (board && board !== state.prevProject) {
            return {
                name: board.name || '',
                prevBoard: board,
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            prevBoard: null,
        };
    }

    render() {
        return (
            <EntityModal>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Board name'
                        onChange={e => this.setState({name: e.target.value})}
                        value={this.state.name}
                    />
                </div>
            </EntityModal>
        );
    }
}

export default connect(
    state => ({
        boards: state.boards,
    }), {
        addBoard,
    },
)(SingleBoardView);

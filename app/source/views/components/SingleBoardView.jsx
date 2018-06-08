import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
    addBoard,
} from '../../model/boards/boardsActions';
import EntityModal from '../../components/EntityModal/EntityModal';
import EntityControllers from '../../components/EntityControllers/EntityControllers';
import * as location from '../../services/location';

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

    submitBoard = () => {};

    deleteBoard = () => {};

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

                <EntityControllers
                    onSave={this.submitBoard}
                    onClose={() => location.push('/scrum')}
                    onDelete={this.deleteBoard}
                />
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
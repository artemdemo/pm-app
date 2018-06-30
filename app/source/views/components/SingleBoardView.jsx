import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
    addBoard,
    updateBoard,
    deleteBoard,
} from '../../model/boards/boardsActions';
import EntityModal from '../../components/EntityModal/EntityModal';
import EntityControllers from '../../components/EntityControllers/EntityControllers';
import Popup from '../../components/Popup/Popup';
import Board from '../../model/boards/Board';
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

        this.popupRef = React.createRef();
    }

    submitBoard = () => {
        const { updateBoard, addBoard, params } = this.props;
        const board = getCurrentBoard(this.props);
        if (params.boardId === 'new') {
            addBoard(new Board({
                name: this.state.name,
            }));
        } else if (board) {
            updateBoard(new Board({
                ...board,
                name: this.state.name,
            }));
        }
        location.push('/scrum');
    };

    deleteBoard = () => {
        this.popupRef.current.show();
    };

    render() {
        return (
            <React.Fragment>
                <EntityModal title='Board'>
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
                <Popup
                    title='Delete board'
                    ref={this.popupRef}
                    buttons={[
                        {
                            text: 'Cancel',
                            className: 'btn btn-light',
                        },
                        {
                            text: 'Delete',
                            className: 'btn btn-primary',
                            onClick: () => {
                                const { deleteBoard } = this.props;
                                const board = getCurrentBoard(this.props);
                                if (board) {
                                    deleteBoard(board.id);
                                }
                                location.push('/scrum');
                            },
                        },
                    ]}
                >
                    Are you sure you want to delete this board?
                </Popup>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        boards: state.boards,
    }), {
        addBoard,
        updateBoard,
        deleteBoard,
    },
)(SingleBoardView);

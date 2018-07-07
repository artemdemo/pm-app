import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Translate } from 'react-localize-redux';
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
            <Translate>
                {({ translate }) => (
                    <React.Fragment>
                        <EntityModal title={translate('board')}>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder={translate('board-name')}
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
                            title={translate('delete-board')}
                            ref={this.popupRef}
                            buttons={[
                                {
                                    text: translate('cancel'),
                                    className: 'btn btn-light',
                                },
                                {
                                    text: translate('delete'),
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
                            {translate('delete-it-question')}
                        </Popup>
                    </React.Fragment>
                )}
            </Translate>
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

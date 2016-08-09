import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { addNewBoard, updateBoard, deleteBoard } from '../../actions/boards';
import { errorMessage } from '../../actions/notification';

import './SingleBoard.less';

class SingleBoard extends Component {
    constructor(props) {
        super(props);

        const board = this.getBoard(props);
        const { boards } = props;
        const boardsList = boards.filter(item => item.id !== board.id);
        const selectedBoardId = board.id_position + 1;

        this.state = {
            title: board.title || '',
            description: board.description || '',
            id_position: selectedBoardId > boardsList.length ? '' : selectedBoardId,
            loadingData: false,
        };

        this.submitBoard = (e) => {
            e.preventDefault();
            const { addNewBoard, updateBoard, errorMessage, onSave } = this.props;
            const board = this.getBoard();
            const idPosition = this.state.id_position;

            if (this.state.title === '') {
                errorMessage('Title can\'t be empty');
                return;
            }

            const updatedBoardData = {
                title: this.state.title,
                description: this.state.description,
                id_position: idPosition ? Number(idPosition) : idPosition,
            };
            this.setState({
                loadingData: true,
            });
            if (board.id) {
                updatedBoardData.id = board.id;
                updateBoard(Object.assign(board, updatedBoardData));
            } else {
                addNewBoard(updatedBoardData);
            }
            onSave();
        };

        this.deleteBoard = () => {
            const board = this.getBoard();
            const { deleteBoard, onDelete } = this.props;
            deleteBoard(board.id);
            onDelete();
        };
    }

    getBoard(props = this.props) {
        return props.board || {};
    }

    render() {
        const { boards, onCancel, className } = this.props;
        const board = this.getBoard();
        const boardsList = boards.filter(item => item.id !== board.id);

        const renderSaveButton = () => {
            const text = board && board.id ? 'Save' : 'Add new';
            return (
                <button type='submit'
                        className='btn btn-primary'
                        disabled={this.state.loadingData}>
                    <span>{text}</span>
                </button>
            );
        };
        const renderLoadingSpinner = () => {
            if (this.state.loadingData) {
                return (
                    <span className='btn btn-link'>
                        <LoadingSpinner />
                    </span>
                );
            }
            return null;
        };
        const renderDeleteButton = () => {
            if (board && board.id) {
                return (
                    <DeleteButton onDelete={this.deleteBoard} />
                );
            }
            return null;
        };

        return (
            <form onSubmit={this.submitBoard}
                  className={className}>
                <div className='form-group'>
                    <input type='text'
                           name='name'
                           className='flat-input'
                           placeholder='Board title'
                           value={this.state.title}
                           onChange={(e) => this.setState({
                               title: e.target.value,
                           })}
                           autoComplete='off'
                           autoFocus
                           data-qa='board-name' />
                </div>
                <div className='form-group'>
                    <textarea className='flat-input'
                              name='description'
                              rows='3'
                              value={this.state.description}
                              onChange={(e) => this.setState({
                                  description: e.target.value,
                              })}
                              data-qa='board-description'></textarea>
                </div>
                <div className='form-group'>
                    <select className='form-control'
                            value={this.state.id_position}
                            onChange={(e) => this.setState({
                                id_position: e.target.value,
                            })}
                            name='board'
                            data-qa='select-board'>
                        <option>Place after all</option>
                        <option disabled>&nbsp;&nbsp;Place before:</option>
                        {boardsList.map((board) => (
                            <option value={board.id_position} key={`board-${board.id}`}>{board.title}</option>
                        ))}
                    </select>
                </div>

                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            {renderSaveButton()}
                            <span className='btn btn-default'
                                  disabled={this.state.loadingData}
                                  onClick={() => onCancel()}
                                  data-qa='board-cancel'>Cancel</span>
                        </span>
                        {renderLoadingSpinner()}
                    </div>
                    <div className='pull-right'>
                        {renderDeleteButton()}
                    </div>
                </div>
            </form>
        );
    }
}

SingleBoard.propTypes = {
    board: React.PropTypes.object,
    className: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
};

export default connect(
    state => {
        return {
            boards: state.boards,
        };
    }, {
        addNewBoard,
        updateBoard,
        deleteBoard,
        errorMessage,
    }
)(SingleBoard);

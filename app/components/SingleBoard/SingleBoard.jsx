import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { hidePopup } from '../../actions/popup';
import { addNewBoard, updateBoard, deleteBoard } from '../../actions/boards';

import './SingleBoard.less';

class SingleBoard extends Component {
    constructor(props) {
        super(props);

        const board = this.getBoard(props);

        this.state = {
            title: board.title || '',
            description: board.description || '',
            id_position: board.id_position || null,
            loadingData: false,
        };

        this.submitBoard = (e) => {
            e.preventDefault();
            const { addNewBoard, updateBoard } = this.props;
            const board = this.getBoard();
            const updatedBoardData = {
                title: this.state.title,
                description: this.state.description,
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
        };

        this.deleteBoard = () => {
            const board = this.getBoard();
            const { deleteBoard } = this.props;
            deleteBoard(board.id);
        };
    }

    getBoard(props = this.props) {
        return props.board || {};
    }

    render() {
        const { board, hidePopup } = this.props;
        const boards = [];

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
                  className='single-board'>
                <div className='form-group'>
                    <input type='text'
                           name='name'
                           className='flat-input'
                           placeholder='Board title'
                           value={this.state.title}
                           onChange={(e) => this.setState({
                               title: e.target.value,
                           })}
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
                            value={this.state.board_id}
                            onChange={(e) => this.setState({
                                id_position: e.target.value,
                            })}
                            name='board'>
                        <option value='0'>Place board after</option>
                        {boards.map((board) => (
                            <option value={board.id} key={`board-${board.id}`}>{board.title}</option>
                        ))}
                    </select>
                </div>

                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            {renderSaveButton()}
                            <span className='btn btn-default'
                                  disabled={this.state.loadingData}
                                  onClick={() => hidePopup()}
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
};

export default connect(
    () => {
        return {};
    }, {
        hidePopup,
        addNewBoard,
        updateBoard,
        deleteBoard,
    }
)(SingleBoard);
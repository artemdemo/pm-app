import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { InputMd } from '../InputMd/InputMd';
import { TextareaMd } from '../TextareaMd/TextareaMd';
import { addNewBoard, updateBoard, deleteBoard } from '../../model/actions/boards';
import { errorMessage } from '../../model/actions/notification';
import emoji from '../../utils/emoji/emoji';

import './SingleBoard.less';

class SingleBoard extends React.PureComponent {
    constructor(props) {
        super(props);

        // ToDo: This code is working here? Assigning state in constructor??
        const { board, boards } = props;
        const boardsList = boards.filter(item => item.id !== board.id);
        const selectedBoardId = board.id_position ? board.id_position + 1 : '';
        this.state = {
            title: board.title || '',
            description: board.description || '',
            id_position: selectedBoardId > boardsList.length ? '' : selectedBoardId,
            loadingData: false,
        };
    }

    submitBoard(e) {
        e.preventDefault();
        const { board, addNewBoard, updateBoard, errorMessage, onSave } = this.props;
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
    }

    deleteBoard() {
        const { board, deleteBoard, onDelete } = this.props;
        deleteBoard(board.id);
        onDelete();
    }

    render() {
        const { board, boards, onCancel, className } = this.props;
        const boardsList = boards.filter(item => item.id !== board.id);

        const renderSaveButton = () => {
            const text = board && board.id ? 'Save' : 'Add new';
            return (
                <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={this.state.loadingData}
                    data-qa='board-save'
                >
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
                    <DeleteButton onDelete={this.deleteBoard.bind(this)} />
                );
            }
            return null;
        };

        return (
            <form
                onSubmit={this.submitBoard.bind(this)}
                className={className}
            >
                <div className='form-group'>
                    <InputMd
                        type='text'
                        name='name'
                        editMode={!board.id}
                        value={this.state.title}
                        onChange={e => this.setState({
                            title: e.target.value,
                        })}
                        className='flat-input'
                        placeholder='Board name'
                        autoComplete='off'
                        data-qa='board-name'
                    />
                </div>
                <div className='form-group'>
                    <TextareaMd
                        className='flat-input'
                        name='description'
                        rows='3'
                        editMode={!board.id || this.state.description === ''}
                        value={this.state.description}
                        onChange={e => this.setState({
                            description: e.target.value,
                        })}
                        placeholder='Board description'
                        data-qa='board-description'
                    />
                </div>
                <div className='form-group'>
                    <select
                        className='form-control'
                        value={this.state.id_position}
                        onChange={e => this.setState({
                            id_position: e.target.value,
                        })}
                        name='board'
                        data-qa='select-board'
                    >
                        <option>Place after all</option>
                        <option disabled>&nbsp;&nbsp;Place before:</option>
                        {boardsList.map(board => (
                            <option
                                value={board.id_position}
                                key={`board-${board.id}`}
                            >
                                {emoji(board.title)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='clearfix'>
                    <div className='pull-left'>
                        <span className='buttons-group'>
                            {renderSaveButton()}
                            <button
                                className='btn btn-default'
                                disabled={this.state.loadingData}
                                onClick={() => onCancel()}
                                type='button'
                                data-qa='board-cancel'
                            >
                                Cancel
                            </button>
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
    board: PropTypes.shape({}),
    className: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

SingleBoard.defaultProps = {
    board: {},
    className: '',
};

export default connect(
    (state) => {
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

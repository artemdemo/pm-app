import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { DeleteButton } from '../DeleteButton/DeleteButton';
import { hidePopup } from '../../actions/popup';

import './SingleBoard.less';

class SingleBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            loadingData: false,
        };

        this.submitBoard = () => {};

        this.deleteBoard = () => {};
    }

    render() {
        const { board, hidePopup } = this.props;

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
                           placeholder='Board name'
                           value={this.state.name}
                           onChange={(e) => this.setState({
                               name: e.target.value,
                           })}
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
    }
)(SingleBoard);

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './DeleteButton.less';

class DeleteButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.loadingData = false;

        this.state = {
            showDelete: false,
        };
    }

    componentWillReceiveProps() {
        this.hideDeleteButtons();
    }

    delete() {
        const { onDelete } = this.props;
        onDelete();
    }

    showDeleteButtons() {
        this.setState({ showDelete: true });
    }

    hideDeleteButtons() {
        this.setState({ showDelete: false });
    }

    render() {
        const deleteTitleClass = classnames({
            btn: true,
            'btn-link': true,
            'btn-link_danger': true,
            btn_disabled: this.loadingData,
        });
        const renderDeleteButtons = () => {
            if (!this.state.showDelete) {
                return (
                    <span
                        className={deleteTitleClass}
                        onClick={this.showDeleteButtons.bind(this)}
                        data-qa='delete-button'
                    >
                        Delete
                    </span>
                );
            }
            return (
                <div className='delete-button'>
                    <div className='delete-button__title'>Delete?</div>
                    <div className='delete-button-buttons'>
                        <span
                            className='glyphicon
                                       glyphicon-ok-sign
                                       delete-button-buttons__ok'
                            aria-hidden='true'
                            onClick={this.delete.bind(this)}
                        />
                        <span
                            className='glyphicon
                                       glyphicon-remove-sign
                                       delete-button-buttons__cancel'
                            aria-hidden='true'
                            onClick={this.hideDeleteButtons.bind(this)}
                        />
                    </div>
                </div>
            );
        };
        return (
            <div>
                {renderDeleteButtons()}
            </div>
        );
    }
}

DeleteButton.propTypes = {
    onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;

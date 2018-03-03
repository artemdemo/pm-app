import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../components/Icon/Icon';

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
                        <Icon
                            name='ok-sign'
                            className='delete-button-buttons__ok'
                            onClick={this.delete.bind(this)}
                        />
                        <Icon
                            name='remove-sign'
                            className='delete-button-buttons__cancel'
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

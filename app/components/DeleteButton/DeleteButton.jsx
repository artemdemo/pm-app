import React, { Component } from 'react';
import classnames from 'classnames';

import './DeleteButton.less';

export class DeleteButton extends Component {
    constructor(props) {
        super(props);
        this.loadingData = false;

        this.state = {
            showDelete: false,
        };

        this.showDeleteButtons = () => this.setState({ showDelete: true });
        this.hideDeleteButtons = () => this.setState({ showDelete: false });

        this.delete = () => {
            const { onDelete } = this.props;
            onDelete();
        };
    }

    componentWillReceiveProps() {
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
                    <span className={deleteTitleClass}
                          onClick={this.showDeleteButtons}
                          data-qa='delete-button'>Delete</span>
                );
            }
            return (
                <div className='delete-button'>
                    <div className='delete-button__title'>Delete?</div>
                    <div className='delete-button-buttons'>
                        <span className='glyphicon
                                         glyphicon-ok-sign
                                         delete-button-buttons__ok'
                              aria-hidden='true'
                              onClick={this.delete}></span>
                        <span className='glyphicon
                                             glyphicon-remove-sign
                                             delete-button-buttons__cancel'
                              aria-hidden='true'
                              onClick={this.hideDeleteButtons}></span>
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
    onDelete: React.PropTypes.func.isRequired,
};

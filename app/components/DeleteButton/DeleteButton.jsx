import React, { Component } from 'react';
import classnames from 'classnames';

import './DeleteButton.less';

export class DeleteButton extends Component {
    constructor(props) {
        super(props);
        this.showDelete = false;
        this.loadingData = false;
        this.showDeleteButtons = () => this.showDelete = true;
        this.hideDeleteButtons = () => this.showDelete = false;
        this.delete = () => {}
    }

    render() {
        const deleteTitleClass = classnames({
            'btn': true,
            'btn-link': true,
            'btn-link_danger': true,
            'btn_disabled': this.loadingData
        });
        const renderDeleteButtons = () => {
            if (!this.showDelete) {
                return (
                    <span className={deleteTitleClass}
                      onClick={this.showDeleteButtons}>Delete</span>
                );
            } else {
                reutrn (
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
            }
        }
        return (
            <div>
                {renderDeleteButtons()}
            </div>
        );
    }
}

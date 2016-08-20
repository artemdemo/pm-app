import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as modalConst from '../../constants/modal';
import { hideModal } from '../../actions/modal';

import './Modal.less';

const MODAL_BG_CLASS = 'pm-modal-bg';

class Modal extends Component {
    constructor(props) {
        super(props);

        this.bgClick = (e) => {
            const { hideModal } = this.props;
            if (e.target.className.indexOf(MODAL_BG_CLASS) > -1) {
                hideModal();
            }
        };
    }

    render() {
        const { modal } = this.props;
        const bgClass = classnames({
            [MODAL_BG_CLASS]: true,
            'pm-modal-bg_fadeIn': true,
        });

        const modalClass = classnames({
            'pm-modal': true,
            'pm-modal_fadeIn': true,
        });

        if (modal.type === modalConst.SHOW_MODAL) {
            return (
                <div className={bgClass} onClick={this.bgClick}>
                    <div className={modalClass}>
                        {modal.content}
                    </div>
                </div>
            );
        }

        return null;
    }
}

export default connect(
    state => {
        return {
            modal: state.modal,
        };
    }, {
        hideModal,
    }
)(Modal);

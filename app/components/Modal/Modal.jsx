import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as modalConst from '../../constants/modal';

import './Modal.less';

class Modal extends Component {
    render() {
        const { modal } = this.props;

        if (modal.type === modalConst.SHOW_MODAL) {
            return (
                <div className='pm-modal-bg'>
                    <div className='pm-modal'>
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
    }
)(Modal);

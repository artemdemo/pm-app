import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as popupConst from '../../constants/popup';

import './Popup.less';

class Popup extends Component {
    render() {
        const { popup } = this.props;

        if (popup.type === popupConst.SHOW_POPUP) {
            return (
                <div className='popup-bg'>
                    <div className='popup'>
                        {popup.content}
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
            popup: state.popup,
        };
    }
)(Popup);

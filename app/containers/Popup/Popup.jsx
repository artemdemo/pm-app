import React from 'react';
import { connect } from 'react-redux';
import * as popupConst from '../../model/popup/popupConst';

import './Popup.less';

const Popup = (props) => {
    const { popup } = props;

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
};

export default connect(
    state => ({
        popup: state.popup,
    }), {}
)(Popup);

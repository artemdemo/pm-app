import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideNotification } from '../../actions/notification';
import * as notificationConst from '../../constants/notification';

import './UserNotificator.less';

class UserNotificator extends Component {
    render() {
        const { notification, hideNotification } = this.props;
        const HIDE_TIMEOUT = 2000;
        let msgClass = 'user-notificator-message';

        switch (notification.type) {
            case notificationConst.ERROR_MSG:
                msgClass += ' user-notificator-message_error';
                break;
            case notificationConst.SUCCESS_MSG:
                msgClass += ' user-notificator-message_success';
                break;
        }

        if (notification.type !== notificationConst.HIDE_MSG) {
            setTimeout(hideNotification, HIDE_TIMEOUT);
            return (
                <div className='user-notificator'>
                    <div className={msgClass}>
                        {notification.message}
                    </div>
                </div>
            );
        }
        return (
            <div className='user-notificator'></div>
        );
    }
}

export default connect(
    state => {
        return {
            notification: state.notification,
        };
    }, {
        hideNotification,
    }
)(UserNotificator);

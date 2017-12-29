import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { hideNotification } from '../../actions/notification';
import * as notificationConst from '../../constants/notification';

import './UserNotificator.less';

const UserNotificator = (props) => {
    const { notification, hideNotification } = props;
    const HIDE_TIMEOUT = 2000;
    let msgTypeClass;

    switch (notification.type) {
        case notificationConst.ERROR_MSG:
            msgTypeClass = 'user-notificator-message_error';
            break;
        case notificationConst.SUCCESS_MSG:
            msgTypeClass = 'user-notificator-message_success';
            break;
    }

    const msgClass = classnames({
        'user-notificator-message': true,
        [msgTypeClass]: true,
        'user-notificator-message_fadeIn': true,
    });

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
        <div className='user-notificator' />
    );
};

export default connect(
    state => ({
        notification: state.notification,
    }), {
        hideNotification,
    }
)(UserNotificator);

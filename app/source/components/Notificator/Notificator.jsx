import React from 'react';
import NotificationSystem from 'react-notification-system';

const notificatorRef = React.createRef();

// @docs https://github.com/igorprado/react-notification-system
const defaultOptions = {
    level: 'info',   // success, error, warning, info
    position: 'tr',  // tr (top right), tl (top left), tc (top center), br (bottom right), bl (bottom left), bc (bottom center)
    autoDismiss: 5,  // Set this to 0 to not auto-dismiss the notification
    onAdd: null,
    onRemove: null,
};

export const errorMsg = (message) => {
    notificatorRef.current.addNotification({
        ...defaultOptions,
        message,
        level: 'error',
    });
};

export const successMsg = (message) => {
    notificatorRef.current.addNotification({
        ...defaultOptions,
        message,
        level: 'success',
    });
};

class Notificator extends React.PureComponent {
    render() {
        return (
            <NotificationSystem ref={notificatorRef} />
        );
    }
}

export default Notificator;

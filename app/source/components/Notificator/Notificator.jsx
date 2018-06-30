import React from 'react';
import NotificationSystem from 'react-notification-system';

const notificatorRef = React.createRef();

let lastMessage = null;
let lastNotificationTimestamp = 0;

// I'm not allowing to same notification pop up more then once per second
// If content of given notification is different from the previous one - it will be shown anyways
const MIN_TIME_BETWEEN_NOTIFICATIONS = 1000;

// @docs https://github.com/igorprado/react-notification-system
const defaultOptions = {
    level: 'info',   // success, error, warning, info
    position: 'tr',  // tr (top right), tl (top left), tc (top center), br (bottom right), bl (bottom left), bc (bottom center)
    autoDismiss: 5,  // Set this to 0 to not auto-dismiss the notification
    onAdd: null,
    onRemove: null,
};

const checkIfAllowed = message => new Promise((resolve) => {
    const now = +(new Date());
    const timePeriod = now - lastNotificationTimestamp;
    if (lastMessage !== message || timePeriod > MIN_TIME_BETWEEN_NOTIFICATIONS) {
        resolve();
        lastMessage = message;
        lastNotificationTimestamp = now;
    }
});

export const errorMsg = message => checkIfAllowed(message)
    .then(() => {
        notificatorRef.current.addNotification({
            ...defaultOptions,
            message,
            level: 'error',
        });
    });

export const successMsg = message => checkIfAllowed(message)
    .then(() => {
        notificatorRef.current.addNotification({
            ...defaultOptions,
            message,
            level: 'success',
        });
    });

class Notificator extends React.PureComponent {
    render() {
        return (
            <NotificationSystem ref={notificatorRef} />
        );
    }
}

export default Notificator;

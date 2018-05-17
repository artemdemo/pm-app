import React from 'react';
import { connect } from 'react-redux';
import UserNotificator from '../../containers/UserNotificator/UserNotificator';
import Modal from '../../containers/Modal/Modal';

class AppView extends React.PureComponent {
    render() {
        return (
            <div className='app'>
                <UserNotificator />
                <Modal />

                {this.props.children}
            </div>
        );
    }
}


export default connect(
    () => ({}),
    {}
)(AppView);

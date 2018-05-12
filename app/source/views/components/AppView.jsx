import React from 'react';
import { connect } from 'react-redux';
import { checkAuthentication } from '../../model/user/userActions';
import UserNotificator from '../../containers/UserNotificator/UserNotificator';
import Modal from '../../containers/Modal/Modal';

class AppView extends React.PureComponent {
    componentWillMount() {
        const { checkAuthentication, location } = this.props;
        checkAuthentication(location);
    }

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
    {
        checkAuthentication,
    }
)(AppView);

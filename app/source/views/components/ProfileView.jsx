import React from 'react';
import { connect } from 'react-redux';

const ProfileView = (props) => {
    const { auth } = props;

    return (
        <React.Fragment>
            <h4>Profile</h4>
            <p>
                Username: {auth.data.username}<br />
                Email: {auth.data.email}
            </p>
        </React.Fragment>
    );
};

export default connect(
    state => ({
        auth: state.auth,
    })
)(ProfileView);

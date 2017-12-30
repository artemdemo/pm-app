import React from 'react';
import { connect } from 'react-redux';
import MainMenu from '../containers/MainMenu/MainMenu';

const ProfileView = (props) => {
    const { user } = props;

    return (
        <div>
            <MainMenu />

            <div className='list-container'>
                <div className='list-container__list'>
                    <h4>Profile</h4>
                    <p>
                        Username: {user.username}<br />
                        Email: {user.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default connect(
    state => ({
        user: state.user,
    })
)(ProfileView);

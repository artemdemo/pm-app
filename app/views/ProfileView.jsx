import React, {Component} from 'react';
import { connect } from 'react-redux';
import MainMenu from '../components/MainMenu/MainMenu';

class ProfileView extends Component {
    render() {
        const { user } = this.props;

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
    }
}

export default connect(
    state => {
        return {
            user: state.user,
        };
    }
)(ProfileView);

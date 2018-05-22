import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../../model/auth/authActions';
import ProfileMenu from './ProfileMenu';

import './MainMenu.less';

class MainMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false,
        };
    }

    logout() {
        const { logout } = this.props;
        logout();
    }

    toggleMenu() {
        this.setState({
            menuOpen: !this.state.menuOpen,
        });
    }

    render() {
        const { auth } = this.props;

        return (
            <div className='main-menu'>
                <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    <Link className='navbar-brand' to='/'>&lt;PM&gt;</Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon' />
                    </button>
                    <div className='collapse navbar-collapse'>
                        <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <Link className='nav-link' to='/tasks'>
                                    Tasks
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link' to='/scrum'>
                                    Scrum
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link' to='/projects'>
                                    Projects
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default connect(
    state => ({
        auth: state.auth,
    }), {
        logout,
    }
)(MainMenu);

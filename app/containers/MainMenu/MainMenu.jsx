import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../../model/actions/user';

import './MainMenu.less';

const ACTIVE_ITEM = 'navbar-link_active';

class MainMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false,
            profileDropdownOpen: false,
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

    toggleProfileDropdown() {
        this.setState({
            profileDropdownOpen: !this.state.profileDropdownOpen,
        });
    }

    render() {
        const { user } = this.props;
        const menuClass = classnames({
            collapse: true,
            'navbar-collapse': true,
            'in': this.state.menuOpen,
        });
        const profileClass = classnames({
            dropdown: true,
            open: this.state.profileDropdownOpen,
        });

        return (
            <nav className='navbar navbar-default navbar-fixed-top'>
                <div className='container'>
                    <div className='navbar-header'>
                        <button
                            type='button'
                            className='navbar-toggle collapsed'
                            onClick={this.toggleMenu.bind(this)}
                        >
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                        </button>
                        <Link className='navbar-brand' to='/'>&lt;PM&gt;</Link>
                    </div>
                    <div className={menuClass}>
                        <ul className='nav navbar-nav'>
                            <li>
                                <Link
                                    to='/tasks'
                                    activeClassName={ACTIVE_ITEM}
                                    className='navbar-link'
                                >
                                    Tasks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/scrum'
                                    activeClassName={ACTIVE_ITEM}
                                    className='navbar-link'
                                >
                                    Scrum
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/projects'
                                    activeClassName={ACTIVE_ITEM}
                                    className='navbar-link'
                                >
                                    Projects
                                </Link>
                            </li>
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            <li className={profileClass}>
                                <span
                                    className='navbar-link'
                                    onClick={this.toggleProfileDropdown.bind(this)}
                                    data-qa='profile-menu-toggle'
                                >
                                    {user.username} <span className='caret' />
                                </span>
                                <ul className='dropdown-menu'>
                                    <li>
                                        <Link to='/profile'>Profile</Link>
                                    </li>
                                    <li>
                                        <Link to='/settings'>Settings</Link>
                                    </li>
                                    <li role='separator' className='divider' />
                                    <li>
                                        <span
                                            className='dropdown-menu-link'
                                            onClick={this.logout.bind(this)}
                                            data-qa='logout-main-menu-button'
                                        >
                                            Logout
                                        </span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default connect(
    state => ({
        user: state.user,
    }), {
        logout,
    }
)(MainMenu);

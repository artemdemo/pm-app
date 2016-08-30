import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../../actions/user';

import './MainMenu.less';

const ACTIVE_ITEM = 'navbar-link_active';

class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false,
            profileDropdownOpen: false,
        };

        this.logout = () => {
            const { logout } = this.props;
            logout();
        };

        this.toggleMenu = () => {
            this.setState({
                menuOpen: !this.state.menuOpen,
            });
        };

        this.toggleProfileDropdown = () => {
            this.setState({
                profileDropdownOpen: !this.state.profileDropdownOpen,
            });
        };
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
                        <button type='button'
                                className='navbar-toggle collapsed'
                                onClick={this.toggleMenu}>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <Link className='navbar-brand' to='/'>&lt;PM&gt;</Link>
                    </div>
                    <div className={menuClass}>
                        <ul className='nav navbar-nav'>
                            <li>
                                <Link to='/tasks'
                                      activeClassName={ACTIVE_ITEM}
                                      className='navbar-link'>
                                    Tasks
                                </Link>
                            </li>
                            <li>
                                <Link to='/scrum'
                                      activeClassName={ACTIVE_ITEM}
                                      className='navbar-link'>
                                    Scrum
                                </Link>
                            </li>
                            <li>
                                <Link to='/projects'
                                      activeClassName={ACTIVE_ITEM}
                                      className='navbar-link'>
                                    Projects
                                </Link>
                            </li>
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            <li className={profileClass}>
                                <span className='navbar-link'
                                      role='button'
                                      onClick={this.toggleProfileDropdown}>
                                    {user.username} <span className='caret'></span>
                                </span>
                                <ul className='dropdown-menu'>
                                    <li>
                                        <Link to='/profile'>Profile</Link>
                                    </li>
                                    <li>
                                        <Link to='/settings'>Settings</Link>
                                    </li>
                                    <li role='separator' className='divider'></li>
                                    <li>
                                        <span className='dropdown-menu-link'
                                              onClick={this.logout}
                                              data-qa='logout-main-menu-button'>
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
    state => {
        return {
            user: state.user,
        };
    }, {
        logout,
    }
)(MainMenu);

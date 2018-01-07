import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../../model/user/userActions';
import ProfileMenu from './ProfileMenu';

import './MainMenu.less';

const ACTIVE_ITEM = 'navbar-link_active';

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
        const { user } = this.props;
        const menuClass = classnames({
            collapse: true,
            'navbar-collapse': true,
            'in': this.state.menuOpen,
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
                        <NavLink className='navbar-brand' to='/'>&lt;PM&gt;</NavLink>
                    </div>
                    <div className={menuClass}>
                        <ul className='nav navbar-nav'>
                            <li>
                                <NavLink
                                    to='/tasks'
                                    activeClassName={ACTIVE_ITEM}
                                    className='navbar-link'
                                >
                                    Tasks
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/scrum'
                                    activeClassName={ACTIVE_ITEM}
                                    className='navbar-link'
                                >
                                    Scrum
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/projects'
                                    activeClassName={ACTIVE_ITEM}
                                    className='navbar-link'
                                >
                                    Projects
                                </NavLink>
                            </li>
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            <ProfileMenu
                                username={user.username}
                                onLogout={this.logout.bind(this)}
                            />
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

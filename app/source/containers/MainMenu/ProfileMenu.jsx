import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import onClickOutside from 'react-click-outside';
import { NavLink } from 'react-router-dom';

class ProfileMenu extends React.PureComponent {
    constructor() {
        super();

        this.state = {
            open: false,
        };
    }

    toggleProfileDropdown() {
        this.setState({
            open: !this.state.open,
        });
    }

    handleClickOutside() {
        if (this.state.open === true) {
            this.setState({
                open: false,
            });
        }
    }

    handleLogout() {
        const { onLogout } = this.props;
        onLogout && onLogout();
    }

    render() {
        const { username } = this.props;

        const profileClass = classnames({
            dropdown: true,
            open: this.state.open,
        });

        return (
            <li className={profileClass}>
                <span
                    className='navbar-link'
                    onClick={this.toggleProfileDropdown.bind(this)}
                    data-qa='profile-menu-toggle'
                >
                    { username } <span className='caret' />
                </span>
                <ul className='dropdown-menu'>
                    <li>
                        <NavLink to='/profile'>Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to='/settings'>Settings</NavLink>
                    </li>
                    <li role='separator' className='divider' />
                    <li>
                        <span
                            className='dropdown-menu-link'
                            onClick={this.handleLogout.bind(this)}
                            data-qa='logout-main-menu-button'
                        >
                            Logout
                        </span>
                    </li>
                </ul>
            </li>
        );
    }
}

ProfileMenu.propTypes = {
    username: PropTypes.string,
    onLogout: PropTypes.func,
};

ProfileMenu.defaultProps = {
    username: null,
    onLogout: null,
};

export default onClickOutside(ProfileMenu);

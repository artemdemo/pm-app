import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import onClickOutside from 'react-click-outside';
import { Link } from 'react-router';
import * as location from '../../services/location';

class ProfileMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
        };
    }

    toggleProfileDropdown() {
        this.setState({
            open: !this.state.open,
        });
    }

    handleClickOutside() {
        this.closeMenu();
    }

    handleLogout = (e) => {
        e.preventDefault();
        const { onLogout } = this.props;
        onLogout && onLogout();
        this.closeMenu();
    };

    handleShowDropdown = (e) => {
        e.preventDefault();
        this.setState({
            showDropdown: true,
        });
    };

    closeMenu = (e) => {
        this.setState({
            showDropdown: false,
        });
    };

    render() {
        const { username } = this.props;

        const dropdownClass = classnames('dropdown-menu dropdown-menu-right', {
            show: this.state.showDropdown,
        });

        return (
            <div className='dropdown'>
                <a
                    href='#'
                    className='nav-link dropdown-toggle'
                    onClick={this.handleShowDropdown}
                >
                    { username }
                </a>
                <div className={dropdownClass}>

                    <Link
                        className='dropdown-item'
                        onClick={this.closeMenu}
                        to={location.wrapUrl('/profile')}
                    >
                        Profile
                    </Link>
                    <Link
                        className='dropdown-item'
                        onClick={this.closeMenu}
                        to={location.wrapUrl('/settings')}
                    >
                        Settings
                    </Link>
                    <div className='dropdown-divider' />
                    <a
                        href='#'
                        className='dropdown-item'
                        onClick={this.handleLogout}
                    >
                        Logout
                    </a>
                </div>
            </div>
        );
    }
}

ProfileMenu.propTypes = {
    username: PropTypes.string,
    onLogout: PropTypes.func,
};

ProfileMenu.defaultProps = {
    username: 'user',
    onLogout: null,
};

export default onClickOutside(ProfileMenu);

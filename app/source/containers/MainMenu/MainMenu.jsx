import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Translate } from 'react-localize-redux';
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

    logout = () => {
        const { logout } = this.props;
        logout();
    };

    navItemClass(path) {
        const { routing } = this.props;
        const isActive = routing.locationBeforeTransitions.pathname === path;
        return classnames({
            'nav-item': true,
            active: isActive,
        });
    }

    render() {
        const { auth } = this.props;
        return (
            <div className='main-menu'>
                <nav className='navbar navbar-expand-sm navbar-light bg-light'>
                    <Link className='navbar-brand' to='/'>&lt;PM&gt;</Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon' />
                    </button>
                    <div className='collapse navbar-collapse'>
                        <ul className='navbar-nav mr-auto'>
                            <li className={this.navItemClass('/tasks')}>
                                <Link className='nav-link' to='/tasks'>
                                    <Translate id='tasks' />
                                </Link>
                            </li>
                            <li className={this.navItemClass('/scrum')}>
                                <Link className='nav-link' to='/scrum'>
                                    <Translate id='scrum' />
                                </Link>
                            </li>
                            <li className={this.navItemClass('/projects')}>
                                <Link className='nav-link' to='/projects'>
                                    <Translate id='projects' />
                                </Link>
                            </li>
                        </ul>
                        <div className='navbar-nav my-lg-0'>
                            <ProfileMenu
                                username={auth.data.username}
                                onLogout={this.logout}
                            />
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default connect(
    state => ({
        auth: state.auth,
        routing: state.routing,
    }), {
        logout,
    }
)(MainMenu);

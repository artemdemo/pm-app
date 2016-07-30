import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../../actions/user';

import './MainMenu.less';

const ACTIVE_ITEM = 'navbar-link_active';

class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.logout = () => {
            const { logout } = this.props;
            logout()
        }
    }

    render() {
        return (
            <nav className='navbar navbar-default'>
                <div className='container'>
                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle collapsed'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <Link className='navbar-brand' to='/'>&lt;PM&gt;</Link>
                    </div>
                    <div id='navbar' className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            <li><Link to='/tasks' activeClassName={ACTIVE_ITEM} className='navbar-link'>Tasks</Link></li>
                            <li><Link to='/scrum' activeClassName={ACTIVE_ITEM} className='navbar-link'>Scrum</Link></li>
                            <li><Link to='/projects' activeClassName={ACTIVE_ITEM} className='navbar-link'>Projects</Link></li>
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            <li><span className='navbar-link'
                                      onClick={this.logout}
                                      data-qa='logout-main-menu-button'>Logout</span></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default connect(
    () => {
        return {}
    }, {
        logout
    }
)(MainMenu);

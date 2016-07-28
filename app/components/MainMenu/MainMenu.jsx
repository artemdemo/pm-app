import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../../actions/user';

import './MainMenu.less';

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
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">&lt;PM&gt;</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li><Link to="/tasks" className="navbar-link">Tasks</Link></li>
                            <li><Link to="/scrum" className="navbar-link">Scrum</Link></li>
                            <li><Link to="/projects" className="navbar-link">Projects</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><span className="navbar-link"
                                      onClick={this.logout}
                                      data-qa="logout-main-menu-button">Logout</span></li>
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
